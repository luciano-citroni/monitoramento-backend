import opentelemetry, { ContextAPI, Meter, SpanStatusCode, Tracer, ValueType } from '@opentelemetry/api';
import { Request, Response } from 'express';

import { LoggerOpenTelemetry, OTEL_SERVICE_VERSION, OTEL_SERVICE_NAME } from '../opentelemetry';
import { Service } from './service';

const service = new Service();

const tracer = opentelemetry.trace.getTracer(OTEL_SERVICE_NAME, OTEL_SERVICE_VERSION);
const meter = opentelemetry.metrics.getMeter(OTEL_SERVICE_NAME, OTEL_SERVICE_VERSION);
const context = opentelemetry.context;
const logger = new LoggerOpenTelemetry();

export class Controller {
    async rolldice(request: Request, response: Response) {
        await tracer.startActiveSpan('Controller.rolldice', {}, context.active(), async (span) => {
            try {
                const histogram = meter.createHistogram('Controller.rolldice.duration', {
                    description: 'Tempo para gerar um numero',
                    unit: 'milliseconds',
                    valueType: ValueType.INT,
                });

                const startTime = new Date().getTime();

                const { max, min } = request.body as { min: number; max: number };

                const number = await service.rolldice({ max: max, min: min });

                response.json({ number: number }).status(200);

                const endTime = new Date().getTime();

                histogram.record(endTime - startTime);
            } catch (err) {
                const message = `Falha ao gerar numero randomico no controller. ${err}`;
                logger.error(message);
                span.recordException(message);
                span.setStatus({ code: SpanStatusCode.ERROR, message: message });

                return response.json({ error: err }).status(500);
            } finally {
                span.end();
            }
        });
    }
}
