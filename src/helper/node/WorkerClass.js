var kRequire =
    typeof module !== 'undefined' && typeof module.require === 'function' && module.require || // eslint-disable-line
    typeof __non_webpack_require__ === 'function' && __non_webpack_require__ || // eslint-disable-line
    typeof require === 'function' && require || // eslint-disable-line
    null; // eslint-disable-line

var WorkerClass = kRequire('worker_threads').Worker; // eslint-disable-line

export {WorkerClass};
