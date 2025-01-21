import {createURLServiceWorkerFactory as browserCreateURLServiceWorkerFactory} from '\0rollup-web-worker-loader::helper::browser::createURLServiceWorkerFactory';
import {isNodeJS} from '\0rollup-web-worker-loader::helper::auto::isNodeJS';

export function createURLServiceWorkerFactory(url) {
    if (isNodeJS()) {
        throw new Error('rollup-web-worker-loader does not support Service Worker in Node.JS');
    }
    return browserCreateURLServiceWorkerFactory(url);
}
