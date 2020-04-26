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

module.exports = extractSource;
