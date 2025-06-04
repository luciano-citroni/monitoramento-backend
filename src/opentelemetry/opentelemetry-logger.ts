import winston from 'winston';
import opentelemetry from '@opentelemetry/api';
import { Logger, SeverityNumber, logs } from '@opentelemetry/api-logs';
import { Request, Response } from 'express';

import { OTEL_SERVICE_NAME, OTEL_SERVICE_VERSION } from '.';
import { LOG_LEVEL } from '../observability';

class LoggerOpenTelemetry {
    logger: Logger;
    consoleLogger: winston.Logger;
    level: 'info' | 'error' | 'debug' | 'fatal' | 'warn' = 'info';

    constructor() {
        this.logger = logs.getLogger(OTEL_SERVICE_NAME, OTEL_SERVICE_VERSION);
        this.level = LOG_LEVEL;

        const transports = process.env.NODE_ENV === 'test' ? [new winston.transports.Console({ silent: true })] : [new winston.transports.Console()];

        this.consoleLogger = winston.createLogger({
            level: this.level,
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
                winston.format((info) => {
                    if (process.env.NODE_ENV !== 'test') {
                        const span = opentelemetry.trace.getActiveSpan();

                        if (span) {
                            info.spanId = span.spanContext().spanId;
                            info.traceId = span.spanContext().traceId;
                        }
                    }

                    return info;
                })(),
                winston.format.json()
            ),
            transports,
        });
    }

    private buildMessage(body: string | { req?: Request; res?: Response }) {
        if (typeof body === 'object' && body.req) {
            return `${body.req.method} ${body.req.originalUrl}`;
        } else if (typeof body === 'object' && body.res && body.res.req) {
            const req = body.res.req as Request;
            const elapsed = (body.res as any).elapsedTime || 0;
            return `${req.method} ${req.originalUrl} ${body.res.statusCode} - ${elapsed} ms`;
        } else if (typeof body === 'string') {
            return body;
        } else {
            return '';
        }
    }

    private logMessage(body: string | { req?: Request; res?: Response }, severityNumber: SeverityNumber, severityText: string) {
        const message = this.buildMessage(body);

        this.consoleLogger[severityText.toLowerCase()](message);

        if (process.env.NODE_ENV !== 'test') {
            this.logger.emit({
                body: message,
                severityNumber,
                severityText,
            });
        }
    }

    info(body: string | { req?: Request; res?: Response }) {
        this.logMessage(body, SeverityNumber.INFO, 'INFO');
    }

    error(body: string | { req?: Request; res?: Response }) {
        this.logMessage(body, SeverityNumber.ERROR, 'ERROR');
    }

    debug(body: string | { req?: Request; res?: Response }) {
        this.logMessage(body, SeverityNumber.DEBUG, 'DEBUG');
    }

    fatal(body: string | { req?: Request; res?: Response }) {
        this.logMessage(body, SeverityNumber.FATAL, 'FATAL');
    }

    warn(body: string | { req?: Request; res?: Response }) {
        this.logMessage(body, SeverityNumber.WARN, 'WARN');
    }

    trace(message: string) {
        if (process.env.NODE_ENV !== 'test') {
            this.logger.emit({
                body: message,
                severityNumber: SeverityNumber.TRACE,
                severityText: 'TRACE',
            });
        }
    }

    child(): LoggerOpenTelemetry {
        return new LoggerOpenTelemetry();
    }
}

export { LoggerOpenTelemetry };
