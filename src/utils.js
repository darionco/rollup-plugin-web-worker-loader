const path = require('path');

function extractSource(code, exports, asFunction = true) {
    let source;
    if (exports.length) {
        let start;
        let comment;
        let i;

        source = code;
        start = source.indexOf('export { ');
        start = start === -1 ? source.indexOf('export default') : start;
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
            start = start === -1 ? source.indexOf('export default') : start;
        }
    } else {
        source = code;
    }

    if (asFunction) {
        return `/* rollup-plugin-web-worker-loader */function () {\n${source}}\n`;
    }
    return `/* rollup-plugin-web-worker-loader */\n${source}\n`;
}

function buildWorkerCode(source, sourcemap = null, inline = true, preserveSource = false, enableUnicode = false) {
    if (inline) {
        if (preserveSource) {
            return `\
/* eslint-disable */\n\
import {createInlineWorkerFactory} from 'rollup-plugin-web-worker-loader::helper';\n\
var WorkerFactory = createInlineWorkerFactory(${source.substring(0, source.length - 1)}, ${sourcemap ? "'" + sourcemap.toUrl() + "'" : 'null'});\n\
export default WorkerFactory;\n\
/* eslint-enable */\n`;
        }

        return `\
/* eslint-disable */\n\
import {createBase64WorkerFactory} from 'rollup-plugin-web-worker-loader::helper';\n\
var WorkerFactory = createBase64WorkerFactory('${Buffer.from(source, enableUnicode ? 'utf16le' : 'utf8').toString('base64')}', ${sourcemap ? "'" + sourcemap.toUrl() + "'" : 'null'}, ${enableUnicode.toString()});\n\
export default WorkerFactory;\n\
/* eslint-enable */\n`;
    }

    return `\
/* eslint-disable */\n\
import {createURLWorkerFactory} from 'rollup-plugin-web-worker-loader::helper';\n\
var WorkerFactory = createURLWorkerFactory('${source}');\n\
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
