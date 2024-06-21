import { fileURLToPath } from 'node:url';
import fastifyCookie from '@fastify/cookie';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import { masqr } from '@rubynetwork/corlink-fastify';
import Fastify from 'fastify';
import { handler as ssrHandler } from '../dist/server/entry.mjs';
import { serverFactory } from './serverFactory';

const app = Fastify({ logger: false, serverFactory: serverFactory });

await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'e',
    parseOptions: {}
});
if (process.env.MASQR) {
    await app.register(masqr, {
        deniedFilePath: fileURLToPath(new URL('./denied.html', import.meta.url)),
        unlockedPaths: ['/bare/'],
        whiteListedURLs: ['https://maindomain.com', 'https://subdomain.maindomain.com'],
        masqrUrl: 'https://corlink.example.com/validate?license=',
        builtinCookieParser: false
    });
}
await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../dist/client', import.meta.url))
});
await app.register(fastifyMiddie);
app.use(ssrHandler);

app.listen({ port: 8080 });
