import { fileURLToPath } from 'node:url';
import fastifyCookie from '@fastify/cookie';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import { masqr } from '@rubynetwork/corlink-fastify';
import chalk from 'chalk';
import Fastify from 'fastify';
import { handler as ssrHandler } from '../dist/server/entry.mjs';
import { serverFactory } from './serverFactory';
import fastifyCompress from '@fastify/compress';

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
await app.register(fastifyCompress, {
    encodings: [
        'br',
        'gzip',
        'deflate'
    ]
})
await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../dist/client', import.meta.url))
});
await app.register(fastifyMiddie);
app.use(ssrHandler);

console.log(chalk.green(`Server listening on ${chalk.bold('http://localhost:8080')}`));
console.log(chalk.magenta(`Server also listening on ${chalk.bold('http://0.0.0.0:8080')}`));

app.listen({ port: 8080, host: '0.0.0.0' });
