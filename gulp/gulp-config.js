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
    watch: src + '/**/*.js',
    src: src + '/quasar.js',
    dest: dist + '/lib',
    webpack: {
      cache: true
    }
  },
  css: {
    watch: src + '/**/*.styl',
    src: src + '/quasar.styl',
    dest: dist + '/lib'
  },

  preview: {
    src: preview
  }
};
