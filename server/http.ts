import fastify from 'fastify';
import { createBareServer } from '@tomphttp/bare-server-node';
import wisp from 'wisp-server-node';
import { createServer } from 'http';
//@ts-expect-error missing types
import createRammerhead from '@rubynetwork/rammerhead/src/server/index.js'
const bare = createBareServer("/bare/");
const rh = createRammerhead();
const rammerheadScopes = [ "/rammerhead.js", "/hammerhead.js", "/transport-worker.js", "/task.js", "/iframe-task.js", "/worker-hammerhead.js", "/messaging", "/sessionexists", "/deletesession", "/newsession", "/editsession", "/needpassword", "/syncLocalStorage", "/api/shuffleDict", "/mainport" ];
const rammerheadSession = /^\/[a-z0-9]{32}/;
const wispOptions = { logging: false }
function shouldRouteRh(req: any) {
  const url = new URL(req.url, "http://0.0.0.0");
  return (rammerheadScopes.includes(url.pathname) || rammerheadSession.test(url.pathname))
}
function routeRhRequest(req: any, res: any) { rh.emit("request", req, res) }
function routeRhUpgrade(req: any, socket: any, head: any) { rh.emit("upgrade", req, socket, head) }
const httpFactory = (handler: any, opts: any) => {
    return createServer()
        .on('request', (req: any, res: any) => {
            if (req.url.startsWith('/rammer')) {
                req.url = req.url.replace('/rammer', '');
            }
            if (bare.shouldRoute(req)) {
                bare.routeRequest(req, res);
            }
            else if (shouldRouteRh(req)) {
                routeRhRequest(req, res);
            }
            else {
                handler(req, res);
            }
        })
        .on('upgrade', (req: any, socket: any, head: any) => {
            if (req.url.startsWith('/rammer')) {
                req.url = req.url.replace('/rammer', '');
            }
            if (bare.shouldRoute(req)) {
                bare.routeUpgrade(req, socket, head);
            } 
            else if (shouldRouteRh(req)) {
                routeRhUpgrade(req, socket, head);
            }
            else if (req.url?.endsWith('/wisp/')) {
                wisp.routeRequest(req, socket, head, wispOptions);
            }
        })
}

export { httpFactory };
