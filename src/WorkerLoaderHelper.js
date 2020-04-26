/* eslint-disable block-scoped-var */
var kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
var kRequire = kIsNodeJS &&
    (typeof module !== 'undefined' && typeof module.require === 'function' && module.require || // eslint-disable-line
        typeof __non_webpack_require__ === 'function' && __non_webpack_require__ || // eslint-disable-line
        typeof require === 'function' && require) || // eslint-disable-line
    null; // eslint-disable-line

export function createInlineWorkerFactory(fn, sourcemapArg) {
    var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
    var source = fn.toString();
    var start = source.indexOf('\n', 10) + 1;
    var end = source.indexOf('}', source.length - 1);
    var body = source.substring(start, end) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
    var blankPrefixLength = body.search(/\S/);
    var lines = body.split('\n');
    for (var i = 0, n = lines.length; i < n; ++i) {
        lines[i] = lines[i].substring(blankPrefixLength) + '\n';
    }

    if (kRequire) {
        /* node.js */
        var Worker = kRequire('worker_threads').Worker; // eslint-disable-line
        var concat = lines.join('\n');
        return function WorkerFactory(options) {
            return new Worker(concat, Object.assign({}, options, { eval: true }));
        };
    }

    /* browser */
    var blob = new Blob(lines, { type: 'application/javascript' });
    var url = URL.createObjectURL(blob);
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}

export function createURLWorkerFactory(url) {
    if (kRequire) {
        /* node.js */
        var Worker = kRequire('worker_threads').Worker; // eslint-disable-line
        return function WorkerFactory(options) {
            return new Worker(url, options);
        };
    }
    /* browser */
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}

export function browserDecodeBase64(base64, enableUnicode) {
    var binaryString = atob(base64);
    if (enableUnicode) {
        var binaryView = new Uint8Array(binaryString.length);
        for (var i = 0, n = binaryString.length; i < n; ++i) {
            binaryView[i] = binaryString.charCodeAt(i);
        }
        return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
    }
    return binaryString;
}

export function nodeDecodeBase64(base64, enableUnicode) {
    return Buffer.from(base64, 'base64').toString(enableUnicode ? 'utf16' : 'utf8');
}

export function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
    var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
    var source = kIsNodeJS ? nodeDecodeBase64(base64, enableUnicode) : browserDecodeBase64(base64, enableUnicode);
    var start = source.indexOf('\n', 10) + 1;
    var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');

    if (kRequire) {
        /* node.js */
        var Worker = kRequire('worker_threads').Worker; // eslint-disable-line
        return function WorkerFactory(options) {
            return new Worker(body, Object.assign({}, options, { eval: true }));
        };
    }

    /* browser */
    var blob = new Blob([body], { type: 'application/javascript' });
    var url = URL.createObjectURL(blob);
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}
