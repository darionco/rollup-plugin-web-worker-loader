import {funcToSource} from '\0rollup-plugin-web-worker-loader::helper::funcToSource';

function createURL(fn, sourcemapArg) {
    var lines = funcToSource(fn, sourcemapArg);
    var blob = new Blob(lines, { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

export function createInlineServiceWorkerFactory(fn, sourcemapArg) {
    var url;
    return function ServiceWorkerFactory(options) {
        url = url || createURL(fn, sourcemapArg);
        return new ServiceWorker(url, options);
    };
}
