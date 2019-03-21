# rollup-plugin-web-worker-loader

Rollup plugin to bundle web worker code to later be instantiated as a Worker.  

Preserves the code so other plugins can modify it and/or transpile it.  
Can be
configured to inline a sourcemap. 

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
        webWorkerLoader(),
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
    sourcemap: boolean,     // should a source map be included in the final output
})
```

### Roadmap
- [x] Bundle file as web worker blob
- [x] Support for dependencies using `import`
- [x] Include source map
- [ ] Provide capability checks and fallbacks
- [ ] Avoid code duplication


