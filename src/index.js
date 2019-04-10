const path = require('path');
const rollup = require('rollup');
const utils = require('./utils');

const bannedPluginNames = [
    'liveServer',
];

module.exports = function workerLoaderPlugin(config = null) {
    const sourcemap = (config && config.sourcemap) || false;

    const idMap = new Map();
    const exclude = new Map();
    let projectOptions = null;
    let basePath = null;

    return {
        name: 'worker-loader',

        options(options ) {
            if (!projectOptions) {
                projectOptions = Object.assign({}, options);
                if (options.plugins && options.plugins.length) {
                    const plugins = [];
                    options.plugins.forEach(plugin => {
                        if (bannedPluginNames.indexOf(plugin.name) === -1) {
                            plugins.push(plugin);
                        }
                    });
                    projectOptions.plugins = plugins;
                    basePath = path.dirname(options.input);
                }
            }

            return null;
        },

        resolveId(importee, importer) {
            if (importee === 'rollup-plugin-web-worker-loader-helper') {
                return path.resolve(__dirname, 'createWorkerFactory.js');
            } else if (importee.indexOf('web-worker:') === 0) {
                const name = importee.split(':')[1];
                const folder = path.dirname(importer);
                const paths = require.resolve.paths(importer);
                paths.push(folder);

                const target = require.resolve(name, { paths });
                if (target && !idMap.has(importee)) {
                    idMap.set(target, Object.assign({}, projectOptions, {
                        input: target,
                    }));

                    return target;
                }
            }
            return null;
        },

        load(id) {
            return new Promise((resolve, reject) => {
                if (idMap.has(id) && !exclude.has(id)) {
                    const inputOptions = idMap.get(id);
                    exclude.set(id, true);
                    rollup.rollup(inputOptions).then(bundle => {
                        exclude.delete(id);
                        bundle.generate({format: 'es', name: id, sourcemap: true}).then(result => {
                            const output = result.output;
                            let chunk = null;
                            for (const ch of output) {
                                if (!ch.isAsset) {
                                    chunk = ch;
                                    break;
                                }
                            }
                            if (chunk !== null) {
                                let source = utils.extractSource(chunk.code, chunk.exports);
                                let map = null;
                                if (sourcemap) {
                                    map = utils.fixMapSources(chunk, basePath);
                                }
                                resolve({code: utils.buildWorkerCode(source, map)});
                            } else {
                                resolve(null);
                            }
                        }).catch(reject);
                    }).catch(reason => {
                        exclude.delete(id);
                        reject(reason);
                    });
                } else {
                    resolve(null);
                }
            })
        },

        transform(code, id) {
            if (idMap.has(id) && !exclude.has(id)) {
                const inputOptions = idMap.get(id);
                return { code, map: `{"version":3,"file":"${path.basename(inputOptions.input)}","sources":[],"sourcesContent":[],"names":[],"mappings":""}` };
            }
            return null;
        },
    };
};
