import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { rh, routeRhRequest, routeRhUpgrade, shouldRouteRh } from './rammerhead';
const bare = createBareServer('/bare/');
import wisp from 'wisp-server-node';
const serverFactory = (handler, opts) => {
    return createServer()
        .on('request', (req, res) => {
            if (bare.shouldRoute(req)) {
                bare.routeRequest(req, res);
            } else if (shouldRouteRh(req)) {
                routeRhRequest(req, res);
            } else {
                handler(req, res);
            }
        })
        .on('upgrade', (req, socket, head) => {
            if (bare.shouldRoute(req)) {
                bare.routeUpgrade(req, socket, head);
            } else if (shouldRouteRh(req)) {
                routeRhUpgrade(req, socket, head);
            } else if (req.url.endsWith('/wisp/')) {
                //@ts-ignore
                wisp.routeRequest(req, socket, head);
            }
        });
};

export { serverFactory };
