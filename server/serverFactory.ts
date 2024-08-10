import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import wisp from 'wisp-server-node';
import { createRammerhead, shouldRouteRh, routeRhRequest, routeRhUpgrade } from '@rubynetwork/rammerhead';
function initRHServer() {
    if (process.env.RAMMERHEAD_SERVER_ENABLED === 'true') {
        const rh = createRammerhead({
            logLevel: 'disabled',
            reverseProxy: true,
            disableLocalStorageSync: false,
            disableHttp2: false
        })
        return rh
    }
}

function initBareServer() {
    if (process.env.BARE_SERVER_ENABLED === 'true') {
        const bare = createBareServer('/bare/');
        return bare;
    }
}

const bare = initBareServer();
const rh = initRHServer();

const serverFactory = (handler: any) => {
    return createServer()
        .on('request', (req: any, res: any) => {
            if (bare?.shouldRoute(req)) {
                bare?.routeRequest(req, res);
            } else if (shouldRouteRh(req)) {
                routeRhRequest(rh, req, res);
            } else {
                handler(req, res);
            }
        })
        .on('upgrade', (req: any, socket: any, head: any) => {
            if (bare?.shouldRoute(req)) {
                bare?.routeUpgrade(req, socket, head);
            } else if (shouldRouteRh(req)) {
                routeRhUpgrade(rh, req, socket, head);
            } else if (req.url?.endsWith('/wisp/')) {
                wisp.routeRequest(req, socket, head);
            }
        });
};

export { serverFactory };
