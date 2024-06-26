if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(async () => {
        //await registerRemoteListener(sw.active!)
        console.log('Service Worker Ready');
        await window.loadProxyScripts();
        await window.setTransport("epoxy");
    });
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
}
