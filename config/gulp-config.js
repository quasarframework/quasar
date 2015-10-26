'use strict';

var
  _ = require('lodash'),

  src         = './src',
  build       = './build',
  dist        = './dist'
  ;

var preview = (function() {
  var base = './preview';

  return {
    base: base,
    preprocess: base + '/preprocess',
    processed: base + '/processed',
  };
}());

function mapToNodeModules(suffix, list) {
  return _.map(list, function(item) {
    if (item.indexOf('!') === 0) {
      return item.substr(1) + suffix;
    }
    return 'node_modules/' + item + suffix;
  });
}


module.exports = {
  plugins: require('gulp-load-plugins')(),
  clean: [build],

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

  js: {
    watch: src + '/js/**/*.js',
    entry: [
      src + '/js/quasar.js'
    ],
    dest: build + '/js',
    depsName: 'quasar-dependencies',
    deps: mapToNodeModules('.js', [
      'jquery/dist/jquery',
      'lodash/index',
      'vue/dist/vue',
      'fastclick/lib/fastclick',
      'quasar-semantic/dist/semantic'
      //'touchswipe/index.js',
      //gsap
    ]),
    webpack: {
      dev: {
        devtool: '#inline-source-map',
        output: {
          libraryTarget: 'umd'
        }
        //devtool: '#cheap-module-eval-source-map'
      },
      prod: {
        output: {
          libraryTarget: 'umd'
        }
      }
    }
  },

  css: {
    watch: src + '/css/**/*.styl',
    entry: [
      src + '/css/quasar.styl'
    ],
    dest: build + '/css',
    depsName: 'quasar-dependencies',
    deps: mapToNodeModules('.css', [
      'quasar-semantic/dist/semantic'
    ]),
    autoprefixer: {browsers: ['last 3 versions']}
  },

  preview: {
    server: {
      port: 3000,
      ui: {port: 3001},
      open: false,
      reloadOnRestart: true,
      server: {
        baseDir: preview.base
      }
    },
    clean: [preview.processed],
    watch: [
      preview.base + '**/*',
      '!' + preview.base + '/quasar/**/*',
      '!' + preview.preprocess + '/**/*',
      '!' + preview.processed + '/**/*'
    ],
    css: {
      watch: preview.preprocess + '/css/**/*.styl',
      entry: [
        preview.preprocess + '/css/project.styl'
      ],
      dest: preview.processed + '/css',
    },
    js: {
      watch: preview.preprocess + '/pages/**/*.js',
      entry: [
        preview.preprocess + '/pages/**/*.js'
      ],
      dest: preview.processed + '/pages',
      webpack: {
        devtool: '#inline-source-map'
      }
    }
  }
};
