if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(async (sw) => {
        //await registerRemoteListener(sw.active!)
        console.log('Service Worker Ready');
        await window.loadScripts();
    });
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
}
