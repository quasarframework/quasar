var _ = require('lodash');
var gutil = require('gulp-util');

var src         = './src';
var src_preview = './src_preview';
var build       = './build';
var dist        = './dist';
var preview     = './preview';

var config = {
    $: (require('gulp-load-plugins'))(),

    style: {
        watch: src+'/style/**/*.scss',
        entry: [
            src+'/style/quasar.scss'
        ],
        dest: build+'/style',
        depsName: 'quasar-dependencies',
        deps: [
            '!semantic/dist/semantic'
        ]
    },
    autoprefixer: {browsers: ['last 1 version']},


    script: {
        watch: src+'/js/**/*.js',
        entry: [
            src+'/js/quasar.js'
        ],
        dest: build+'/js',
        depsName: 'quasar-dependencies',
        deps: [
            'jquery/dist/jquery',
            'lodash/index',
            'vue/dist/vue',
            'fastclick/lib/fastclick',
            //'touchswipe/index.js',
            //gsap
            '!semantic/dist/semantic'
        ]
    },

    banner: {
        src: [
            build+'/**/*.js',
            build+'/**/*.css'
        ],
        dest: build
    },

    clean: [build, preview],

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
    },

    dist: {
        src: build+'/**/*',
        dest: dist
    }
};

config.script.deps = _.map(config.script.deps, function(item) {
    if (item.startsWith('!')) {
        return item.substr(1)+'.js';
    }
    return 'node_modules/'+item+'.js';
});
config.style.deps = _.map(config.style.deps, function(item) {
    if (item.startsWith('!')) {
        return item.substr(1)+'.css';
    }
    return 'node_modules/'+item+'.css';
});

module.exports = config;