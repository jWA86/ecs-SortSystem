const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: ["./src/SortSystem.ts"],
    watch: false,
    output: {
        path: path.resolve('./dist'),
        filename: "index.js",
        libraryTarget: 'umd',
        library: 'ecs-sortsystem'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                // exclude:/\.spec.ts?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.ts' ]
    },
    externals: 
    {
        "ecs-framework": "umd ecs-framework"
    },
    // plugins: [new UglifyJSPlugin({ sourceMap : true }) 
    //    ]
};