import {createURLAudioWorkletFactory as browserCreateURLAudioWorkletFactory} from '\0rollup-web-worker-loader::helper::browser::createURLAudioWorkletFactory';
import {isNodeJS} from '\0rollup-web-worker-loader::helper::auto::isNodeJS';

export function createURLAudioWorkletFactory(url) {
    if (isNodeJS()) {
        throw new Error('rollup-web-worker-loader does not support Audio Worklet in Node.JS');
    }
    return browserCreateURLAudioWorkletFactory(url);
}
