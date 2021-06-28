import {createBase64AudioWorkletFactory as browserCreateBase64AudioWorkletFactory} from '\0rollup-plugin-web-worker-loader::helper::browser::createBase64AudioWorkletFactory';
import {isNodeJS} from '\0rollup-plugin-web-worker-loader::helper::auto::isNodeJS';

export function createBase64AudioWorkletFactory(base64, sourcemapArg, enableUnicodeArg) {
    if (isNodeJS()) {
        throw new Error('rollup-plugin-web-worker-loader does not support Audio Worklet in Node.JS');
    }
    return browserCreateBase64AudioWorkletFactory(base64, sourcemapArg, enableUnicodeArg);
}
