export function createURLServiceWorkerFactory(url) {
    return function ServiceWorkerFactory(options) {
        return new ServiceWorker(url, options);
    };
}
