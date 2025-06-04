import { httpLogger } from './middleware/logger';
import { LoggerOpenTelemetry, OpenTelemetry } from './opentelemetry';
import { server } from './server/server';

if (process.env.NODE_ENV != 'test') {
    const otel = new OpenTelemetry();
    otel.startSdk();

    server.use(httpLogger);
}

const logger = new LoggerOpenTelemetry();

server.listen(process.env.APP_PORT || 3333, async () => {
    logger.info(`O backend está rodando na porta ${process.env.APP_PORT || 3333}`);
});
