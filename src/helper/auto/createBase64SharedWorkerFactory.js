import {createBase64SharedWorkerFactory as browserCreateBase64SharedWorkerFactory} from '\0rollup-web-worker-loader::helper::browser::createBase64SharedWorkerFactory';
import {isNodeJS} from '\0rollup-web-worker-loader::helper::auto::isNodeJS';

export function createBase64SharedWorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    if (isNodeJS()) {
        throw new Error('rollup-web-worker-loader does not support Shared Worker in Node.JS');
    }
    return browserCreateBase64SharedWorkerFactory(base64, sourcemapArg, enableUnicodeArg);
}
