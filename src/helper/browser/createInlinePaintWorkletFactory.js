import {funcToSource} from '\0rollup-web-worker-loader::helper::funcToSource';

function createURL(fn, sourcemapArg) {
    var lines = funcToSource(fn, sourcemapArg);
    var blob = new Blob(lines, { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

export function createInlinePaintWorkletFactory(fn, sourcemapArg) {
    var url;
    return function PaintWorkletFactory(options) {
        url = url || createURL(fn, sourcemapArg);
        return CSS.paintWorklet.addModule(url, options);
    };
}

