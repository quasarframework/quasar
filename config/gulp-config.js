'use strict';

var
    _ = require('lodash'),

    src         = './src',
    build       = './build',
    dist        = './dist',

    src_preview = './src_preview',
    preview = './preview'
;

function mapToNodeModules(suffix, list) {
    return _.map(list, function(item) {
        if (item.indexOf('!') === 0) {
            return item.substr(1) + suffix;
        }
        return 'node_modules/'+item+suffix;
    });
}


module.exports = {
    $: (require('gulp-load-plugins'))(),

    clean: [build],

    banner: {
        src: [
            build+'/**/*.js',
            build+'/**/*.css'
        ],
        dest: build
    },

    dist: {
        src: build+'/**/*',
        dest: dist
    },

    script: {
        watch: src+'/js/**/*.js',
        entry: [
            src+'/js/quasar.js'
        ],
        dest: build+'/js',
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
                devtool: '#inline-source-map'
                //devtool: '#cheap-module-eval-source-map'
            },
            prod: {}
        }
    },

    style: {
        watch: src+'/style/**/*.scss',
        entry: [
            src+'/style/quasar.scss'
        ],
        dest: build+'/style',
        depsName: 'quasar-dependencies',
        deps: mapToNodeModules('.css', [
            'quasar-semantic/dist/semantic'
        ]),
        autoprefixer: {browsers: ['last 3 versions']}
    },

    preview: {
        server: {
            port: 3000,
            ui: { port: 3001 },
            open: false,
            reloadOnRestart: true,
            server: {
                baseDir: preview
            }
        },
        html: {
            src: src_preview+'/**/*.html',
            dest: preview
        },
        image: {
            src: src_preview+'/images/**/*',
            dest: preview
        },
        style: {
            watch: src_preview+'/style/**/*.scss',
            entry: [
                src_preview+'/style/project.scss'
            ],
            dest: preview+'/style',
        },
        script: {
            watch: src_preview+'/js/**/*.js',
            entry: [
                src_preview+'/js/project.js'
            ],
            dest: preview+'/js',
        },
        deps: {
            src: build+'/**/*',
            dest: preview+'/quasar'
        }
    }
};
