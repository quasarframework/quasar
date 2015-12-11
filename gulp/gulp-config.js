'use strict';

var
  src         = './src',
  build       = './build',
  dist        = './dist',
  preview     = './preview',
  generated   = '__generated_quasar'
  ;

module.exports = {
  clean: [
    build, dist, 'coverage',
    src + '/lib/' + generated + '.js',
    src + '/lib/' + generated + '.styl'
  ],

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
    all: [
      src + '/**/*.js',
      '!' + src + '/' + generated + '.js'
    ],
    src: src + '/' + generated + '.js',
    dest: dist + '/lib',
    webpack: {}
  },
  css: {
    all: [
      src + '/**/*.styl',
      '!' + src + '/' + generated + '.styl'
    ],
    src: src + '/' + generated + '.styl',
    dest: dist + '/lib'
  },
  html: {
    all: src + '/**/*.html'
  },

  preprocess: {
    dir: src,
    file: generated
  },

  preview: {
    src: preview
  }
};
