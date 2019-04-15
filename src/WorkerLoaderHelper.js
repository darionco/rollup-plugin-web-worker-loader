export function createInlineWorkerFactory(fn, sourcemap = null) {
    const source = fn.toString();
    const start = source.indexOf('\n', 10) + 1;
    const end = source.indexOf('}', source.length - 1);
    const body = source.substring(start, end) + (sourcemap ? `//# sourceMappingURL=${sourcemap}` : '');
    const lines = body.split('\n').map(line => line.substring(4) + '\n');

    if (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') {
        /* node.js */
        const Worker = require('worker_threads').Worker; // eslint-disable-line
        const concat = lines.join('\n');
        return function WorkerFactory(options) {
            return new Worker(concat, Object.assign({}, options, { eval: true }));
        };
    }

    /* browser */
    const blob = new Blob(lines, { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}

export function createURLWorkerFactory(url) {
    if (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') {
        /* node.js */
        const Worker = require('worker_threads').Worker; // eslint-disable-line
        return function WorkerFactory(options) {
            return new Worker(url, options);
        };
    }
    /* browser */
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}
