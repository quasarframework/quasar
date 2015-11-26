'use strict';

var
  src         = './src',
  build       = './build',
  dist        = './dist',
  preview     = './preview'
  ;

module.exports = {
  clean: [build, dist, 'coverage'],

  deps: {
    name: 'quasar-dependencies',
    js: [
      'jquery/dist/jquery',
      'lodash/index',
      'vue/dist/vue',
      'fastclick/lib/fastclick',
      'semantic-ui-css/semantic'
    ],
    css: [
      'semantic-ui-css/semantic'
    ],
    dest: dist + '/deps',
    semantic: 'node_modules/semantic-ui-css'
  },

  js: {
    all: src + '/**/*.js',
    src: build + '/quasar.js',
    dest: dist + '/lib',
    webpack: {}
  },
  css: {
    all: src + '/**/*.styl',
    src: build + '/quasar.styl',
    dest: dist + '/lib'
  },

  lib: {
    src: src + '/lib',
    dest: build
  },

  preview: {
    src: preview
  }
};
