const path = require('path');

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

    return `/* rollup-plugin-web-worker-loader */function () {\n${source}}\n`;
}

function buildWorkerCode(code, sourcemap = null) {
    return `\
/* eslint-disable */\n\
import {createWorkerFactory} from 'rollup-plugin-web-worker-loader-helper';\n\
const WorkerFactory = createWorkerFactory(${code.substring(0, code.length - 1)}, ${sourcemap ? `'${sourcemap.toUrl()}'` : 'null'});\n\
export default WorkerFactory;\n\
/* eslint-enable */\n`;
}

function findFullPath(file, length, modules) {
    const keys = Object.keys(modules);
    for (let i = 0; i < keys.length; ++i) {
        if (keys[i].endsWith(file) && modules[keys[i]].originalLength === length) {
            return keys[i];
        }
    }
    return null;
}

function fixMapSources(chunk, basePath) {
    const map = chunk.map;
    const newSourcesComponents = [];
    let maxUpFolder = 0;
    for (let i = 0; i < map.sources.length; ++i) {
        const full = findFullPath(map.sources[i], map.sourcesContent[i].length, chunk.modules);
        if (full) {
            const relative = path.relative(basePath, full);
            const base = path.dirname(relative);
            const components = base.split(path.sep);
            const newComponents = [];
            let upFolder = 0;
            for (let component of components) {
                if (component === '..') {
                    ++upFolder;
                } else {
                    newComponents.push(component);
                }
            }
            newComponents.push(path.basename(full));
            maxUpFolder = Math.max(maxUpFolder, upFolder);

            newSourcesComponents[i] = newComponents;
        } else {
            newSourcesComponents[i] = null;
        }
    }

    const basePathComponents = basePath.split(path.sep);
    const newBaseComponents = [];
    for (let i = 0; i < maxUpFolder; ++i) {
        newBaseComponents.unshift(basePathComponents.pop());
    }
    const newBase = path.resolve('/web-worker', ...newBaseComponents);

    for (let i = 0; i < map.sources.length; ++i) {
        if (newSourcesComponents[i]) {
            map.sources[i] = 'worker:/' + path.resolve(newBase, ...newSourcesComponents[i]);
        }
    }

    return map;
}

module.exports = {
    extractSource,
    buildWorkerCode,
    fixMapSources,
};
