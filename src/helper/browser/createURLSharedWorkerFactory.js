export function createURLSharedWorkerFactory(url) {
    return function WorkerFactory(options) {
        return new SharedWorker(url, options);
    };
}
