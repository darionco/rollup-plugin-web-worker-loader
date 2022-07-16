function generateBundle(state, config, options, bundle, isWrite) {
    if (!config.inline && isWrite) {
        if (state.configuredFileNames.size > 0 && Object.keys(bundle).length === 1) {
            bundle[Object.keys(bundle)[0]].fileName = state.configuredFileNames.get(options.format);
        }
        for (const worker of state.idMap) {
            if (worker[1].chunk && !bundle[worker[1].workerID]) {
                bundle[worker[1].workerID] = worker[1].chunk;
            }
        }
    }
}

module.exports = generateBundle;
