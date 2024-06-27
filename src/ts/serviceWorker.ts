function initServiceWorker() {
    return new Promise<void>((resolve) => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(async () => {
                //await registerRemoteListener(sw.active!)
                console.log('Service Worker Ready');
                //@ts-ignore
                await window.loadProxyScripts();
                //@ts-ignore
                await window.setTransport(localStorage.getItem("incog||transport"));
                resolve();
            });
            navigator.serviceWorker.register('/sw.js', { scope: '/' });
        }
    })
}

export { initServiceWorker }
