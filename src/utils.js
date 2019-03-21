function extractSource(code, exports) {
    let source;
    if (exports.length) {
        let start;
        let comment;
        let i;

        source = code;
        start = source.indexOf('export { ');
        while (start !== -1) {
            comment = '';
            for (i = start; i < source.length; ++i) {
                if (source[i] === '\n') {
                    break;
                }
                comment += '/';
            }
            source = source.substring(0, start) + comment + source.substring(i);
            start = source.indexOf('export { ');
        }
    } else {
        source = code;
    }

    return `/* rollup-plugin-webworker-loader */function () {\n${source}}\n`;
}

function buildWorkerCode(code, sourcemap = null) {
    return `\
/* eslint-disable */\n\
import {createWorkerFactory} from 'rollup-plugin-webworker-loader-helper';\n\
const WorkerFactory = createWorkerFactory(${code.substring(0, code.length - 1)}, ${sourcemap ? `'${sourcemap.toUrl()}'` : 'null'});\n\
export default WorkerFactory;\n\
/* eslint-enable */\n`;
}

module.exports = {
    extractSource,
    buildWorkerCode,
};
