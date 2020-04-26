export function funcToSource(fn, sourcemapArg) {
    var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
    var source = fn.toString();
    var start = source.indexOf('\n', 10) + 1;
    var end = source.indexOf('}', source.length - 1);
    var body = source.substring(start, end) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
    var blankPrefixLength = body.search(/\S/);
    var lines = body.split('\n');
    for (var i = 0, n = lines.length; i < n; ++i) {
        lines[i] = lines[i].substring(blankPrefixLength) + '\n';
    }
    return lines;
}
