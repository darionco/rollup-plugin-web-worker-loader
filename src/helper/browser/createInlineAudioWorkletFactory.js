import {funcToSource} from '\0rollup-plugin-web-worker-loader::helper::funcToSource';

function createURL(fn, sourcemapArg) {
    var lines = funcToSource(fn, sourcemapArg);
    var blob = new Blob(lines, { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

export function createInlineAudioWorkletFactory(fn, sourcemapArg) {
    var url;
    return async function AudioWorkletFactory(audioContext, options) {
        url = url || createURL(fn, sourcemapArg);
        return await audioContext.audioWorklet.addModule(url, options);
    };
}
