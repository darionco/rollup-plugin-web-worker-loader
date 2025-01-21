import {WorkerClass} from '\0rollup-web-worker-loader::helper::node::WorkerClass';

export function createURLWorkerFactory(url) {
    return function WorkerFactory(options) {
        return new WorkerClass(url, options);
    };
}
