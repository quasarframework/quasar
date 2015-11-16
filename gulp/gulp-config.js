'use strict';

var
  src         = './src',
  build       = './build',
  dist        = './dist',
  preview     = './preview'
  ;

module.exports = {
  preview: preview,
  clean: [build, dist],
  plugins: require('gulp-load-plugins')(),

  banner: {
    src: [
      build + '/**/*.js',
      build + '/**/*.css'
    ],
    dest: build
  },

  dist: {
    src: build + '/**/*',
    dest: dist
  },

  deps: {
    name: 'quasar-dependencies',
    dest: build,
    js: {
      src: [
        'jquery/dist/jquery',
        'lodash/index',
        'vue/dist/vue',
        'fastclick/lib/fastclick'
      ],
      dest: build + '/js'
    },
    css: {
      src: [],
      dest: build + '/css'
    }
  },

  js: {
    all: src + '/js/**/*.js',
    entry: [
      src + '/js/quasar.js'
    ],
    dest: build + '/js',
    webpack: {
      output: {
        libraryTarget: 'umd'
      }
    }
  },

  css: {
    all: src + '/css/**/*.styl',
    entry: [
      src + '/css/quasar.styl'
    ],
    dest: build + '/css'
  }
};
