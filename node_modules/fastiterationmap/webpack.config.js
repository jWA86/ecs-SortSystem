const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
    entry: ["./src/FastIterationMap.ts"],
    watch: false,
    output: {
        path: path.resolve('./dist'),
        filename: "index.js",
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.ts' ]
    },
    // plugins: [new UglifyJSPlugin({sourceMap:true}) 
    //   ]
};