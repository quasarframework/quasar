
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      'build/js/quasar-dependencies.js',
      'src/js/quasar.js',
      'test/setup.js',
      'test/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/js/quasar.js': ['webpack']
    },

    webpack: {
      output: {
        libraryTarget: 'umd'
      },
      module: {
        postLoaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|resources\/js\/vendor)/,
            loader: 'istanbul-instrumenter'
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'lcov',
          subdir: '.'
        }
      ]
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-sinon-chai',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-mocha-reporter'
    ]
  });
};
