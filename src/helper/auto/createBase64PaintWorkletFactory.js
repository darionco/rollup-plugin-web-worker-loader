import {createBase64PaintWorkletFactory as browserCreateBase64PaintWorkletFactory} from '\0rollup-plugin-web-worker-loader::helper::browser::createBase64AudioWorkletFactory';
import {isNodeJS} from '\0rollup-plugin-web-worker-loader::helper::auto::isNodeJS';

export function createBase64PaintWorkletFactory(base64, sourcemapArg, enableUnicodeArg) {
    if (isNodeJS()) {
        throw new Error('rollup-plugin-web-worker-loader does not support Paint Worklet in Node.JS');
    }
    return browserCreateBase64PaintWorkletFactory(base64, sourcemapArg, enableUnicodeArg);
}
