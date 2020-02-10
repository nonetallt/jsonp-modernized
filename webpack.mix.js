const mix = require('laravel-mix');

mix.webpackConfig({
    output: {
        library: 'jsonp',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: 'window'
    }
});

// Compile package into dist
if(mix.inProduction()) {
    mix.js('index.js', 'dist/jsonp.min.js');
}
else {
    mix.js('index.js', 'dist/jsonp.js').sourceMaps();
}
