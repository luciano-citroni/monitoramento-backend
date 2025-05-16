import * as client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register: register });

const httpRequestCounter = new client.Counter({
    name: 'http_request_total',
    help: 'Total de requisicoes',
    labelNames: ['method', 'route', 'status'],
});

const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duração das requisições HTTP em segundos',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);

export { register, httpRequestCounter, httpRequestDuration };
