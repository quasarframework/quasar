var lint = require('mocha-eslint');

// Array of paths to lint
// Note: a seperate Mocha test will be run for each path and each file which
// matches a glob pattern
var paths = [
  'gulp/**/*.js',
  'src/**/*.js',
  'preview/src/**/*.js',
  'tests/**/*.spec.js'
];

// Specify style of output
var options = {
  formatter: 'compact',
  alwaysWarn: false
};

// Run the tests
lint(paths, options);
