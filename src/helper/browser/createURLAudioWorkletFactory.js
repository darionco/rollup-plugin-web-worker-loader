export function createURLAudioWorkletrFactory(url) {
    return async function AudioWorkletFactory(audioContext, options) {
        return await audioContext.audioWorklet.addModule(url, options);
    };
}
