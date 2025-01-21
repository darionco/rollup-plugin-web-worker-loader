import {createURLPaintWorkletFactory as browserCreateURLPaintWorkletFactory} from '\0rollup-web-worker-loader::helper::browser::createURLPaintWorkletFactory';
import {isNodeJS} from '\0rollup-web-worker-loader::helper::auto::isNodeJS';

export function createURLPaintWorkletFactory(url) {
    if (isNodeJS()) {
        throw new Error('rollup-web-worker-loader does not support Paint Worklet in Node.JS');
    }
    return browserCreateURLPaintWorkletFactory(url);
}

