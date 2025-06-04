// src/middlewares/httpLogger.ts
import { Request, Response, NextFunction } from 'express';
import { LoggerOpenTelemetry } from '../opentelemetry';

const logger = new LoggerOpenTelemetry();

export function httpLogger(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    res.on('finish', () => {
        const [s, ns] = process.hrtime(start);
        const durationMs = (s * 1000 + ns / 1e6).toFixed(2);

        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`);
    });

    next();
}
