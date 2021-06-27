export function createURLWorkerFactory(url) {
    return async function WorkerFactory(audioContext, options) {
        return await audioContext.audioWorklet.addModule(url, options);
    };
}
