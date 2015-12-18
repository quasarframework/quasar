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
    assets: [
      {
        src: 'node_modules/material-design-icons/iconfont/*.{eot,otf,ttf,woff,woff2}',
        dest: 'assets/fonts/icons'
      },
      {
        src: 'node_modules/roboto-fontface/fonts/Roboto-{Thin,Light,Regular,Medium,Bold}.{eot,otf,ttf,woff,woff2}',
        dest: 'assets/fonts/roboto'
      }
    ],
    dest: dist + '/app-additions/'
  },

  lint: {
    js: src + '/**/*.js',
    css: src + '/**/*.styl'
  },

  js: {
    watch: [
      src + '/**/*.js',
      src + '/**/*.html'
    ],
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
