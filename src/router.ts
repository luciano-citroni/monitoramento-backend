import { Router } from 'express';
import { testeRouter } from './api/router';
import { register } from './metrics/metrics';

const router = Router();

router.use('/teste', testeRouter);

router.get('/metric', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

export { router };
