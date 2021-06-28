const options = require('./plugin/options');
const resolveId = require('./plugin/resolveId');
const load = require('./plugin/load');
const transform = require('./plugin/transform');
const outputOptions = require('./plugin/outputOptions');
const generateBundle = require('./plugin/generateBundle');

const defaultConfig = {
    targetPlatform: 'auto',
    sourcemap: false,
    loadPath: '',
    preserveSource: false,
    preserveFileNames: false,
    enableUnicode: false,
    webWorkerPattern: /web-worker:(.+)/,
    audioWorkletPattern: /audio-worklet:(.+)/,
    // paintWorkletPattern: /paint-worklet:(.+)/,
    // animationWorkletPattern: /animation-worklet:(.+)/,
    // serviceWorkerPattern: /service-worker:(.+)/,
    inline: true,
    forceInline: false,
    external: undefined,
    extensions: [ '.js' ],
    outputFolder: '',
    skipPlugins: [
        'liveServer',
        'serve',
        'livereload',
    ],
};

module.exports = function workerLoaderPlugin(userConfig = null) {
    if (userConfig) {
        userConfig.webWorkerPattern = userConfig?.webWorkerPattern || userConfig?.pattern || null;
    }
    const config = Object.assign({}, defaultConfig, userConfig);
    config.skipPlugins = new Set(config.skipPlugins);

    const state = {
        idMap: new Map(),
        exclude: new Set(),
        outFiles: new Map(),
        options: null,
        basePath: null,
        forceInlineCounter: 0,
        configuredFileName: null,
    };

    return {
        name: 'rollup-plugin-web-worker-loader',

        options(optionsArg) {
            return options(state, config, optionsArg);
        },

        resolveId(importee, importer) {
            return resolveId(state, config, importee, importer);
        },

        load(id) {
            return load(state, config, this.addWatchFile, id);
        },

        transform(code, id) {
            return transform(state, config, code, id);
        },

        outputOptions(options) {
            return outputOptions(state, config, options);
        },

        generateBundle(options, bundle, isWrite) {
            generateBundle(state, config, options, bundle, isWrite);
        },
    };
};
