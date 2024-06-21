import createRammerhead from 'rammerhead/src/server/index.js';
const rh = createRammerhead();
const rammerheadScopes = [
    '/rammerhead.js',
    '/hammerhead.js',
    '/transport-worker.js',
    '/task.js',
    '/iframe-task.js',
    '/worker-hammerhead.js',
    '/messaging',
    '/sessionexists',
    '/deletesession',
    '/newsession',
    '/editsession',
    '/needpassword',
    '/syncLocalStorage',
    '/api/shuffleDict',
    '/mainport'
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRh(req: any) {
    const url = new URL(req.url, 'http://0.0.0.0');
    return rammerheadScopes.includes(url.pathname) || rammerheadSession.test(url.pathname);
}

function routeRhRequest(req: any, res: any) {
    rh.emit('request', req, res);
}

function routeRhUpgrade(req: any, socket: any, head: any) {
    rh.emit('upgrade', req, socket, head);
}

export { shouldRouteRh, routeRhUpgrade, routeRhRequest, rh };
