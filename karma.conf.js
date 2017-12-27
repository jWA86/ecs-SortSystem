module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ["mocha", "karma-typescript"],
        files: [
            { pattern: "src/**/*.ts" },
            { pattern: "test/**/*.ts" },
            "node_modules/es6-shim/es6-shim.js",
            { 
                pattern:  './test/img/*',
                watched:  true,
                served:   true,
                included: false, 
            }
        ],
        preprocessors: {
            "src/**/*.ts": ["karma-typescript", "coverage"],
            "test/**/*.ts": ["karma-typescript"]
        },
        reporters: ["progress", "karma-typescript", "coverage"],

        browsers: ["Chrome", "Firefox", "IE", "PhantomJS"],
        
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
          },

        singleRun: false,
        concurrency: Infinity
    });
};