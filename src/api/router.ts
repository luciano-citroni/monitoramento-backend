import { Router, Request, Response } from 'express';
import { Controller } from './controller';

const testeRouter = Router();

const controller = new Controller();

testeRouter.post('/rolldice', controller.rolldice);

export { testeRouter };
