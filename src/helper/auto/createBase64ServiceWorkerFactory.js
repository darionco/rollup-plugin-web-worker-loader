import {createBase64ServiceWorkerFactory as browserCreateBase64ServiceWorkerFactory} from '\0rollup-web-worker-loader::helper::browser::createBase64ServiceWorkerFactory';
import {isNodeJS} from '\0rollup-web-worker-loader::helper::auto::isNodeJS';

export function createBase64ServiceWorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    if (isNodeJS()) {
        throw new Error('rollup-web-worker-loader does not support Service Worker in Node.JS');
    }
    return browserCreateBase64ServiceWorkerFactory(base64, sourcemapArg, enableUnicodeArg);
}
