import {funcToSource} from '\0rollup-plugin-web-worker-loader::helper::funcToSource';

export function createInlineWorkerFactory(fn, sourcemapArg) {
    var lines = funcToSource(fn, sourcemapArg);
    var blob = new Blob(lines, { type: 'application/javascript' });
    var url = URL.createObjectURL(blob);
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}
