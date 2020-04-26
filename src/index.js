const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const utils = require('./utils');

module.exports = function workerLoaderPlugin(config = null) {
    const sourcemap = (config && config.sourcemap) || false;
    const loadPath = config && config.hasOwnProperty('loadPath') ? config.loadPath : '';
    const preserveSource = config && config.hasOwnProperty('preserveSource') ? config.preserveSource : false;
    const enableUnicode = config && config.hasOwnProperty('enableUnicodeSupport') ? config.enableUnicodeSupport : false;
    const pattern = config && config.hasOwnProperty('pattern') ? config.pattern : /web-worker:(.+)/;
    const skipPlugins = new Set(config && config.hasOwnProperty('skipPlugins') ? config.skipPlugins : [
        'liveServer',
        'serve',
        'livereload',
    ]);

    let inline = config && config.hasOwnProperty('inline') ? config.inline : true;
    const forceInline = inline && config && config.hasOwnProperty('forceInline') ? config.forceInline : false;

    const helperPattern = /rollup-plugin-web-worker-loader::helper(?:::[0-9]+)?$/;
    const idMap = new Map();
    const exclude = new Set();
    let projectOptions = null;
    let basePath = null;
    let configuredFileName = null;
    let forceInlineCounter = 0;

    return {
        name: 'rollup-plugin-web-worker-loader',

        options(options) {
            if (!projectOptions) {
                projectOptions = Object.assign({}, options);
                if (options.plugins && options.plugins.length) {
                    const plugins = [];
                    options.plugins.forEach(plugin => {
                        if (skipPlugins.has(plugin.name)) return;

                        plugins.push(plugin);
                    });
                    projectOptions.plugins = plugins;

                    const cwd = process.cwd();
                    if (typeof options.input === 'string') {
                        try {
                            const entry = require.resolve(options.input, { paths: [cwd] });
                            basePath = path.dirname(entry);
                        } catch (e) { /* EMPTY */ }
                    } else if (Array.isArray(options.input)) {
                        let componentCount = Number.MAX_SAFE_INTEGER;
                        let shortestPath = null;
                        for (let i = 0, n = options.input.length; i < n; ++i) {
                            try {
                                const entry = require.resolve(options.input[i], { paths: [cwd] });
                                const entryPath = path.dirname(entry);
                                const components = entryPath.split(path.sep);
                                if (components.length < componentCount) {
                                    componentCount = components.length;
                                    shortestPath = entryPath;
                                }
                            } catch (e) { /* EMPTY */ }
                        }
                        basePath = shortestPath;
                    } else {
                        const keys = Object.keys(options.input);
                        let componentCount = Number.MAX_SAFE_INTEGER;
                        let shortestPath = null;
                        for (let i = 0, n = keys.length; i < n; ++i) {
                            const input = options.input[keys[i]];
                            try {
                                const entry = require.resolve(input, { paths: [cwd] });
                                const entryPath = path.dirname(entry);
                                const components = entryPath.split(path.sep);
                                if (components.length < componentCount) {
                                    componentCount = components.length;
                                    shortestPath = entryPath;
                                }
                            } catch (e) { /* EMPTY */ }
                        }
                        basePath = shortestPath;
                    }

                    if (!basePath) {
                        basePath = '.';
                    }
                }
            }

            return null;
        },

        resolveId(importee, importer) {
            const match = importee.match(pattern);
            if (importee === 'rollup-plugin-web-worker-loader::helper') {
                if (forceInline) {
                    return `${importee}::${forceInlineCounter++}`;
                }
                return path.resolve(__dirname, 'WorkerLoaderHelper.js');
            } else if (match && match.length) {
                const name = match[match.length - 1];
                if (!idMap.has(name)) {
                    let target = null;
                    if (importer) {
                        const folder = path.dirname(importer);
                        const paths = require.resolve.paths(importer);
                        paths.push(folder);
                        target = require.resolve(name, {paths});
                    } else if (path.isAbsolute(name)) {
                        target = name;
                    }

                    if (target) {
                        const prefixed = `\0rollup-plugin-worker-loader::module:${forceInline ? `:${forceInlineCounter++}:` : ''}${name}`;
                        if (!idMap.has(prefixed)) {
                            const inputOptions = Object.assign({}, projectOptions, {
                                input: target,
                            });

                            idMap.set(prefixed, {
                                workerID: `web-worker-${idMap.size}.js`,
                                chunk: null,
                                inputOptions,
                                target,
                            });
                        }

                        if (idMap.has(prefixed)) {
                            return prefixed;
                        }
                        return target;
                    }
                }
            }
            return null;
        },

        load(id) {
            return new Promise((resolve, reject) => {
                if (helperPattern.test(id)) {
                    fs.readFile(path.resolve(__dirname, 'WorkerLoaderHelper.js'), 'utf8', (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    });
                } else if (idMap.has(id) && !exclude.has(id)) {
                    if (!inline) {
                        /* inline requires rollup version 1.9.2 or higher */
                        const version = this.meta.rollupVersion.split('.');
                        if (version.length !== 3) {
                            this.warn('Unknown rollup version');
                            inline = true;
                        } else {
                            const major = parseInt(version[0], 10);
                            const minor = parseInt(version[1], 10);
                            const patch = parseInt(version[2], 10);
                            if (
                                isNaN(major) ||
                                isNaN(minor) ||
                                isNaN(patch) ||
                                major < 1 ||
                                (major === 1 && minor < 9) ||
                                (major === 1 && minor === 9 && patch < 2)
                            ) {
                                this.warn(`Rollup version 1.9.2 or higher is required for emitting a worker file (current version:${this.meta.rollupVersion}). See https://github.com/rollup/rollup/issues/2801`);
                                inline = true;
                            }
                        }
                    }

                    const {inputOptions, workerID, target} = idMap.get(id);
                    exclude.add(id);
                    exclude.add(target);
                    rollup.rollup(inputOptions).then(bundle => {
                        exclude.delete(id);
                        exclude.delete(target);
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
                                /* add dependencies to watch list */
                                const deps = Object.keys(chunk.modules);
                                for (const dep of deps) {
                                    this.addWatchFile(dep);
                                }

                                let map = null;
                                let source;
                                if (inline) {
                                    source = utils.extractSource(chunk.code, chunk.exports, preserveSource);
                                    map = null;
                                    if (sourcemap) {
                                        map = utils.fixMapSources(chunk, basePath);
                                    }
                                } else {
                                    source = path.posix.join(loadPath, workerID);
                                    chunk.fileName = workerID;
                                    idMap.get(id).chunk = chunk;
                                }
                                resolve({code: utils.buildWorkerCode(source, map, inline, preserveSource, enableUnicode)});
                            } else {
                                resolve(null);
                            }
                        }).catch(reject);
                    }).catch(reason => {
                        exclude.delete(id);
                        exclude.delete(target);
                        reject(reason);
                    });
                } else {
                    resolve(null);
                }
            });
        },

        transform(code, id) {
            if (idMap.has(id) && !exclude.has(id)) {
                const {inputOptions} = idMap.get(id);
                return { code, map: `{"version":3,"file":"${path.basename(inputOptions.input)}","sources":[],"sourcesContent":[],"names":[],"mappings":""}` };
            }
            return null;
        },

        outputOptions(options) {
            if (!inline && options.file && !options.dir) {
                configuredFileName = path.basename(options.file);
                return Object.assign({}, options, {
                    file: null,
                    dir: path.dirname(options.file),
                });
            }
            return null;
        },

        generateBundle(options, bundle, isWrite) {
            if (!inline && isWrite) {
                if (configuredFileName && Object.keys(bundle).length === 1) {
                    bundle[Object.keys(bundle)[0]].fileName = configuredFileName;
                }
                for (const worker of idMap) {
                    if (worker[1].chunk && !bundle[worker[1].workerID]) {
                        bundle[worker[1].workerID] = worker[1].chunk;
                    }
                }
            }
        },
    };
};
