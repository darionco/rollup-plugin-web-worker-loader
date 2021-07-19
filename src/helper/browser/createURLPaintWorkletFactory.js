export function createURLPaintWorkletFactory(url) {
    return async function PaintWorkletFactory(options) {
        return await CSS.paintWorklet.addModule(url, options);
    };
}

