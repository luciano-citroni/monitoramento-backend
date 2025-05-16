import { server } from './server/server';

server.listen(process.env.APP_PORT || 3333, async () => {
    console.log(`O backend está rodando na porta ${process.env.APP_PORT || 3333}`);
});
