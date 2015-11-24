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
      dest: dist + '/minimal/deps'
    },
    semantic: 'semantic-ui-css/semantic',
    full: {
      dest: dist + '/full/deps'
    }
  },

  minimal: {
    lib: {
      src: src + '/lib/**/*',
      dest: dist + '/minimal/lib'
    },
    semantic: {
      src: 'node_modules/semantic-ui-css',
      dest: dist + '/minimal/lib/semantic'
    }
  },

  full: {
    lib: {
      dest: dist + '/full/lib'
    }
  },

  js: {
    all: src + '/**/*.js'
  },
  css: {
    all: src + '/**/*.styl'
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
