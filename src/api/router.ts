import { Router, Request, Response } from 'express';
import { httpRequestCounter, httpRequestDuration } from '../metrics/metrics';

const testeRouter = Router();

testeRouter.get('/', (request: Request, response: Response) => {
    const end = httpRequestDuration.startTimer();

    const teste = 'ola mundo';

    response.json({ result: teste }).status(200);

    httpRequestCounter.inc({
        method: request.method,
        route: '/teste',
        status: 200,
    });

    end({ method: request.method, route: '/teste', status: 200 });
});

export { testeRouter };
