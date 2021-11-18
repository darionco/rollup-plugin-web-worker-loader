import {createURL} from '\0rollup-plugin-web-worker-loader::helper::browser::createInlineWorkerFactory';

export function createInlineSharedWorkerFactory(fn, sourcemapArg) {
    var url;
    return function WorkerFactory(options) {
        url = url || createURL(fn, sourcemapArg);
        return new SharedWorker(url, options);
    };
}
