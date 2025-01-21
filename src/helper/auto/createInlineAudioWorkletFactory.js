import {createInlineAudioWorkletFactory as browserCreateInlineAudioWorkletFactory} from '\0rollup-web-worker-loader::helper::browser::createInlineAudioWorkletFactory';
import {isNodeJS} from '\0rollup-web-worker-loader::helper::auto::isNodeJS';

export function createInlineAudioWorkletFactory(fn, sourcemapArg) {
    if (isNodeJS()) {
        throw new Error('rollup-web-worker-loader does not support Audio Worklet in Node.JS');
    }
    return browserCreateInlineAudioWorkletFactory(fn, sourcemapArg);
}
