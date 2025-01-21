import {createURLSharedWorkerFactory as browserCreateURLSharedWorkerFactory} from '\0rollup-web-worker-loader::helper::browser::createURLSharedWorkerFactory';
import {isNodeJS} from '\0rollup-web-worker-loader::helper::auto::isNodeJS';

export function createURLSharedWorkerFactory(url) {
    if (isNodeJS()) {
        throw new Error('rollup-web-worker-loader does not support Shared Worker in Node.JS');
    }
    return browserCreateURLSharedWorkerFactory(url);
}
