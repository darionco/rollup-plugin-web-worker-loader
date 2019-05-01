# rollup-plugin-web-worker-loader

Rollup plugin to handle Web Workers.

Can inline the worker code or emit a script file using code-splitting.  
Handles Worker dependencies and can emit source maps.  
Worker dependencies are added to Rollup's watch list. 
Supports bundling workers for Node.js environments 

### Getting started

```
yarn add rollup-plugin-web-worker-loader --dev
```

Add the plugin to your rollup configuration:

```javascript
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

export default {
    entry: 'src/index.js',
    plugins: [ 
        webWorkerLoader(/* configuration */),
    ],
    format: 'esm',
};
```

Bundle the worker code using the prefix `web-worker:` in your imports:

```javascript
import DataWorker from 'web-worker:./DataWorker';

const dataWorker = new DataWorker();
dataWorker.postMessage('Hello World!');
```

### Configuration
The plugin responds to the following configuration options:
```javascript
webWorkerLoader({
    sourcemap?: boolean,        // when inlined, should a source map be included in the final output. Default: false
    
    inline?: boolean,           // should the worker code be inlined (Base64). Default: true
    
    preserveSource?: boolean,   // when inlined and this option is enabled, the full source code is included in the
                                // built file, otherwise it's embedded as a base64 string. Default: false
                                
    loadPath?: string           // this options is useful when the worker scripts need to be loaded from another folder.
                                // Default: ''
})
```

### Notes
WARNING: To use code-splitting for the worker scripts, Rollup v1.9.2 or higher is required. See https://github.com/rollup/rollup/issues/2801 for more details.

The `sourcemap` configuration option is ignored when `inline` is set to `false`, in that case the project's sourcemap configuration is inherited.

`loadPath` is meant to be used in situations where code-splitting is used (`inline = false`) and the entry script is hosted in a different folder than the worker code.  


### Roadmap
- [x] Bundle file as web worker blob
- [x] Support for dependencies using `import`
- [x] Include source map
- [x] Configuration options to inline or code-split workers
- [ ] Provide capability checks and fallbacks
- [ ] Avoid code duplication


