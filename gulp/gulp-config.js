'use strict';

var
  src         = './src',
  build       = './build',
  dist        = './dist',
  preview     = './preview'
  ;

module.exports = {
  bailOnError: true, // automatically becomes false on preview
  clean: [build, dist, 'coverage'],

  deps: {
    name: 'quasar-dependencies',
    js: [
      'jquery/dist/jquery',
      'vue/dist/vue',
      'fastclick/lib/fastclick',
      'hammerjs/hammer',
      'velocity-animate/velocity',
      'velocity-animate/velocity.ui'
    ],
    // css: [],
    dest: dist + '/deps'
  },

  appAdditions: {
    assets: [
      {
        src: 'node_modules/material-design-icons/iconfont/*.woff',
        dest: 'assets/fonts/icons'
      },
      {
        src: 'node_modules/roboto-fontface/fonts/roboto/Roboto-{Thin,Light,Regular,Medium,Bold}.woff',
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
    dest: dist + '/js',
    webpack: {
      cache: true
    },
    define: {
      __QUASAR_VERSION__: JSON.stringify(require('../package.json').version)
    }
  },

  css: {
    watch: src + '/**/*.styl',
    themes: {
      ios: [
        src + '/themes/common-core/*.styl',
        src + '/themes/common-components/*.styl',
        src + '/themes/ios/*.styl'
      ],
      mat: [
        src + '/themes/common-core/*.styl',
        src + '/themes/common-components/*.styl',
        src + '/themes/mat/*.styl'
      ]
    },
    lib: src + '/lib/**/*.styl',
    dest: dist + '/css'
  },

  preview: {
    src: preview
  }
};
