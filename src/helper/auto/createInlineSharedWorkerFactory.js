import {createInlineSharedWorkerFactory as browserCreateInlineSharedWorkerFactory} from '\0rollup-web-worker-loader::helper::browser::createInlineSharedWorkerFactory';
import {isNodeJS} from '\0rollup-web-worker-loader::helper::auto::isNodeJS';

export function createInlineSharedWorkerFactory(fn, sourcemapArg) {
    if (isNodeJS()) {
        throw new Error('rollup-web-worker-loader does not support Shared Worker in Node.JS');
    }
    return browserCreateInlineSharedWorkerFactory(fn, sourcemapArg);
}
