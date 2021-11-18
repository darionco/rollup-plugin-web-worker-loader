import {createInlineServiceWorkerFactory as browserCreateInlineServiceWorkerFactory} from '\0rollup-plugin-web-worker-loader::helper::browser::createInlineServiceWorkerFactory';
import {isNodeJS} from '\0rollup-plugin-web-worker-loader::helper::auto::isNodeJS';

export function createInlineServiceWorkerFactory(fn, sourcemapArg) {
    if (isNodeJS()) {
        throw new Error('rollup-plugin-web-worker-loader does not support Service Worker in Node.JS');
    }
    return browserCreateInlineServiceWorkerFactory(fn, sourcemapArg);
}
