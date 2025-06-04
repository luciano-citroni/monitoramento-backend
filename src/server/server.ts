import express from 'express';

import 'dotenv/config';
import cors from 'cors';
import { router } from '../router';

const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/v1', router);

export { server };
