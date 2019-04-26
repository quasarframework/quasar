'use strict';

require('mocha-eslint')(
  // paths
  [
    'bin/quasar',
    'assets/**/*.js',
    'cmds/**/*.js',
    'lib/**/*.js',
    'src/**/*.js',
    'preview/src/**/*.js',
    'test/**/*.spec.js'
  ],
  // options
  {
    formatter: 'compact',
    alwaysWarn: false
  }
);
