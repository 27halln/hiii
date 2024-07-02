/// <reference path="../.astro/env.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@titaniumnetwork-dev/ultraviolet/client" />
declare global {
    interface Window {
        openApp(url: string): void;
        searchApps(val: string): void;
        setTheme(val: string): void;
        setProxy(val: string): void;
        transport(val: string): void;
        changeTitle(val: string): void;
        changeFavicon(val: string): void;
        searchGames(val: string): void;
        fullScreenGame(val: string): void;
        loadProxyScripts(): Promise;
        setTransport(transport: string): Promise;
        loadMobileNav(): void;
        closeMobileNav(): void;
        createLink(): void;
        exitIframe(): void;
        refreshIframe(): void;
        setTitle(): void;
        __uv: any;
        __get$ProxyUrl: any;
    }
}

//Force TS to recognize this as a module
export {}
