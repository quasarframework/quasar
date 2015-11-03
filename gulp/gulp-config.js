'use strict';

var
  _ = require('lodash'),

  src         = './src',
  build       = './build',
  dist        = './dist',
  preview     = './preview'
  ;

function mapToNodeModules(suffix, list) {
  return _.map(list, function(item) {
    if (item.indexOf('!') === 0) {
      return item.substr(1) + suffix;
    }
    return 'node_modules/' + item + suffix;
  });
}


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
    js: {
      src: mapToNodeModules('.js', [
        'jquery/dist/jquery',
        'lodash/index',
        'vue/dist/vue',
        'fastclick/lib/fastclick',
        'quasar-semantic/dist/semantic'
        //'touchswipe/index.js',
        //gsap
      ]),
      dest: build + '/js'
    },
    css: {
      src: mapToNodeModules('.css', [
        'quasar-semantic/dist/semantic'
      ]),
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
