import {createURL} from '\0rollup-web-worker-loader::helper::browser::createBase64WorkerFactory';

export function createBase64SharedWorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    var url;
    return function WorkerFactory(options) {
        url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
        return new SharedWorker(url, options);
    };
}
