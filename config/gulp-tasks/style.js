'use strict';

var
    gulp = require('gulp'),
    config = require('../gulp-config')
;

gulp.task('style:lint', function() {
    gulp.src(config.style.watch)
        .pipe(config.$.scssLint({customReport: config.$.scssLintStylish}));
});


gulp.task('dev:style:deps', function() {
    return gulp.src(config.style.deps)
        .pipe(config.$.newer(config.style.dest + '/' + config.style.depsName + '.css'))
        .pipe(config.$.sourcemaps.init())
        .pipe(config.$.concat(config.style.depsName+'.css'))
        .pipe(config.$.sourcemaps.write())
        .pipe(gulp.dest(config.style.dest));
});

gulp.task('prod:style:deps', function() {
    return gulp.src(config.style.deps)
        .pipe(config.$.concat(config.style.depsName+'.min.css'))
        .pipe(config.$.minifyCss({processImport: false}))
        .pipe(gulp.dest(config.style.dest));
});


gulp.task('dev:style', ['style:lint'], function() {
    return gulp.src(config.style.entry)
        .pipe(config.$.changed(config.style.dest))
        .pipe(config.$.sourcemaps.init())
        .pipe(config.$.sass().on('error', config.$.sass.logError))
        .pipe(config.$.autoprefixer(config.style.autoprefixer))
        .pipe(config.$.sourcemaps.write())
        .pipe(gulp.dest(config.style.dest));
});

gulp.task('prod:style', ['style:lint'], function() {
    return gulp.src(config.style.entry)
        .pipe(config.$.changed(config.style.dest))
        .pipe(config.$.sass().on('error', config.$.sass.logError))
        .pipe(config.$.autoprefixer(config.style.autoprefixer))
        .pipe(config.$.minifyCss())
        .pipe(config.$.rename({extname: '.min.css'}))
        .pipe(gulp.dest(config.style.dest));
});


gulp.task('development:style', ['dev:style', 'dev:style:deps']);
gulp.task('production:style', ['prod:style', 'prod:style:deps']);