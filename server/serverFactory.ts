import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { routeRhRequest, routeRhUpgrade, shouldRouteRh } from './rammerhead';
const bare = createBareServer('/bare/');
import wisp from 'wisp-server-node';
const serverFactory = (handler: any) => {
    return createServer()
        .on('request', (req: any, res: any) => {
            if (process.env.BARE_SERVER_ENABLED === "true") {
                if (bare.shouldRoute(req)) {
                    bare.routeRequest(req, res);
                } else if (shouldRouteRh(req)) {
                    routeRhRequest(req, res);
                } else {
                    handler(req, res);
                }
            } else {
                if (shouldRouteRh(req)) {
                    routeRhRequest(req, res);
                }
                else {
                    handler(req, res);
                }
            }
        })
        .on('upgrade', (req: any, socket: any, head: any) => {
            if (process.env.BARE_SERVER_ENABLED === "true") {
                if (bare.shouldRoute(req)) {
                    bare.routeUpgrade(req, socket, head);
                } else if (shouldRouteRh(req)) {
                    routeRhUpgrade(req, socket, head);
                } else if (req.url.endsWith('/wisp/')) {
                    //@ts-ignore
                    wisp.routeRequest(req, socket, head);
                }
            } else {
                if (shouldRouteRh(req)) {
                    routeRhUpgrade(req, socket, head);
                }
                else {
                    //@ts-ignore
                    wisp.routeRequest(req, socket, head);
                }
            }
        });
};

export { serverFactory };
