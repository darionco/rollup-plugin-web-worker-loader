export function createURLPaintWorkletFactory(url) {
    return function PaintWorkletFactory(options) {
        return CSS.paintWorklet.addModule(url, options);
    };
}

