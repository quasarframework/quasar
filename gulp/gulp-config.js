'use strict';

var
  src         = './src',
  build       = './build',
  dist        = './dist',
  preview     = './preview'
  ;

module.exports = {
  clean: [build, dist],

  deps: {
    name: 'quasar-dependencies',
    core: {
      js: [
        'jquery/dist/jquery',
        'lodash/index',
        'vue/dist/vue',
        'fastclick/lib/fastclick'
      ],
      css: [],
      dest: dist + '/build/deps'
    },
    semantic: 'semantic-ui-css/semantic',
    full: {
      dest: dist + '/full/deps'
    }
  },

  build: {
    lib: {
      src: src + '/lib/**/*',
      dest: dist + '/build/lib'
    },
    semantic: {
      src: 'node_modules/semantic-ui-css',
      dest: dist + '/build/lib/semantic'
    }
  },

  full: {
    lib: {
      dest: dist + '/full/lib'
    }
  },

  js: {
    all: src + '/lib/**/*.js'
  },
  css: {
    all: src + '/lib/**/*.styl'
  },

  preprocess: {
    src: {
      js: src + '/quasar.js',
      css: src + '/quasar.styl'
    },
    core: src + '/lib/core/*/*.js',
    full: src + '/lib/*/*/*',
  },

  preview: preview
};
