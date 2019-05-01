const kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
const kRequire = kIsNodeJS ? module.require : null; // eslint-disable-line

export function createInlineWorkerFactory(fn, sourcemap = null) {
    const source = fn.toString();
    const start = source.indexOf('\n', 10) + 1;
    const end = source.indexOf('}', source.length - 1);
    const body = source.substring(start, end) + (sourcemap ? `//# sourceMappingURL=${sourcemap}` : '');
    const blankPrefixLength = body.search(/\S/);
    const lines = body.split('\n').map(line => line.substring(blankPrefixLength) + '\n');

    if (kIsNodeJS) {
        /* node.js */
        const Worker = kRequire('worker_threads').Worker; // eslint-disable-line
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
    if (kIsNodeJS) {
        /* node.js */
        const Worker = kRequire('worker_threads').Worker; // eslint-disable-line
        return function WorkerFactory(options) {
            return new Worker(url, options);
        };
    }
    /* browser */
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}

export function createBase64WorkerFactory(base64, sourcemap = null) {
    const source = kIsNodeJS ? Buffer.from(base64, 'base64').toString('ascii') : atob(base64);
    const start = source.indexOf('\n', 10) + 1;
    const body = source.substring(start) + (sourcemap ? `//# sourceMappingURL=${sourcemap}` : '');

    if (kIsNodeJS) {
        /* node.js */
        const Worker = kRequire('worker_threads').Worker; // eslint-disable-line
        return function WorkerFactory(options) {
            return new Worker(body, Object.assign({}, options, { eval: true }));
        };
    }

    /* browser */
    const blob = new Blob([body], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}
