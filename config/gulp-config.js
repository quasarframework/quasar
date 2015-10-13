'use strict';

var
  _ = require('lodash'),

  src         = './src',
  build       = './build',
  dist        = './dist',

  srcPreview = './srcPreview',
  preview = './preview';

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

  script: {
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

  style: {
    watch: src + '/style/**/*.scss',
    entry: [
      src + '/style/quasar.scss'
    ],
    dest: build + '/style',
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
        baseDir: preview
      }
    },
    html: {
      src: srcPreview + '/**/*.html',
      dest: preview
    },
    image: {
      src: srcPreview + '/images/**/*',
      dest: preview
    },
    style: {
      watch: srcPreview + '/style/**/*.scss',
      entry: [
        srcPreview + '/style/project.scss'
      ],
      dest: preview + '/style',
    },
    script: {
      watch: srcPreview + '/js/**/*.js',
      entry: [
        srcPreview + '/js/project.js'
      ],
      dest: preview + '/js',
    },
    deps: {
      src: build + '/**/*',
      dest: preview + '/quasar'
    }
  }
};
