import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { httpFactory } from './http';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = fastify({ logger: false, serverFactory: httpFactory })

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'src'),
  prefix: '/',
  serve: true,
  wildcard: false
});

app.setNotFoundHandler((req: any, res: any) => {
  res.sendFile("index.html"); // SPA catch-all
});

const prt = parseInt(process.env.PORT) || 3000;

console.log(chalk.green(`Server running at http://localhost:${prt}`));
console.log(chalk.magenta(`Server also running at http://0.0.0.0:${prt}`));
console.log(chalk.red('Press Ctrl+C to quit'));
app.listen({ port: prt, host: '0.0.0.0' });
