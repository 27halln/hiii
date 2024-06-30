import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import wisp from 'wisp-server-node';
import { routeRhRequest, routeRhUpgrade, shouldRouteRh } from './rammerhead';

function initBareServer() {
    if (process.env.BARE_SERVER_ENABLED === 'true') {
        const bare = createBareServer('/bare/');
        return bare;
    }
}

const bare = initBareServer();

const serverFactory = (handler: any) => {
    return createServer()
        .on('request', (req: any, res: any) => {
            if (process.env.BARE_SERVER_ENABLED === 'true') {
                if (bare?.shouldRoute(req)) {
                    bare?.routeRequest(req, res);
                }
            }
            if (shouldRouteRh(req)) {
                routeRhRequest(req, res);
            } else {
                handler(req, res);
            }
        })
        .on('upgrade', (req: any, socket: any, head: any) => {
            if (process.env.BARE_SERVER_ENABLED === 'true') {
                if (bare?.shouldRoute(req)) {
                    bare?.routeUpgrade(req, socket, head);
                }
            }
            if (shouldRouteRh(req)) {
                routeRhUpgrade(req, socket, head);
            }
            if (req.url?.endsWith('/wisp/')) {
                wisp.routeRequest(req, socket, head);
            }
        });
};

export { serverFactory };
