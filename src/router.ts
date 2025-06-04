import { Router } from 'express';
import { testeRouter } from './api/router';

const router = Router();

router.use('/teste', testeRouter);

export { router };
