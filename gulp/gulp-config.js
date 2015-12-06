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
      'hammerjs/hammer',
      'velocity-animate/velocity',
      'velocity-animate/velocity.ui'
    ],
    css: [
      'normalize.css/normalize'
    ],
    dest: dist + '/deps'
  },

  appAdditions: {
    src: src + '/app-additions/**/*',
    dest: dist + '/app-additions'
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
  html: {
    all: src + '/**/*.html'
  },

  lib: {
    src: src + '/lib',
    dest: build
  },

  preview: {
    src: preview
  }
};
