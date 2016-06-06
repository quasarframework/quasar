
var webpack = require('gulp-pipes').js.webpack;

module.exports = function(config) {
  config.set({

    // list of files / patterns to load in the browser
    files: [
      'dist/lib/quasar.css',
      'test/setup-predeps.js',
      'dist/deps/quasar-dependencies.js',
      'test/setup-postdeps.js',
      'src/quasar.js',
      'test/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/quasar.js': ['webpack', 'sourcemap']
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        postLoaders: [
          {
            test: /\.js$/,
            exclude: /(test|node_modules|bower_components)\//,
            loader: 'istanbul-instrumenter'
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          __QUASAR_VERSION__: JSON.stringify('0.0.0')
        })
      ]
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

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'Pjs'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

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
      'karma-mocha-reporter',
      'karma-sourcemap-loader'
    ],

    customLaunchers: {
      Pjs: {
        base: 'PhantomJS',
        options: {
          viewportSize: {
            width: 800,
            height: 800
          }
        }
      }
    }
  });
};
