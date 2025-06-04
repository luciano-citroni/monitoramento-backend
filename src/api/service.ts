import opentelemetry, { ContextAPI, SpanStatusCode, Tracer } from '@opentelemetry/api';

import { LoggerOpenTelemetry, OTEL_SERVICE_VERSION, OTEL_SERVICE_NAME } from '../opentelemetry';

const tracer = opentelemetry.trace.getTracer(OTEL_SERVICE_NAME, OTEL_SERVICE_VERSION);
const context = opentelemetry.context;
const logger = new LoggerOpenTelemetry();

export class Service {
    async rolldice({ max, min }: { max: number; min: number }) {
        return tracer.startActiveSpan('Service.rolldice', {}, context.active(), async (span) => {
            try {
                const randomNumber = Math.floor(Math.random() * (max - min + 1) + min).toString();

                logger.info(`numero gerado: ${randomNumber}`);
                span.addEvent(`numero gerado: ${randomNumber}`);
                span.end();

                return randomNumber;
            } catch (err) {
                const message = `Falha ao gerar numero randomico. ${err}`;
                logger.error(message);
                span.recordException(message);
                span.setStatus({ code: SpanStatusCode.ERROR, message: message });
                span.end();

                throw err;
            }
        });
    }
}
