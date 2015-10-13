'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins;

gulp.task('style:lint', function() {
  gulp.src(config.style.watch)
    .pipe(plugins.scssLint({customReport: plugins.scssLintStylish}));
});


gulp.task('dev:style:deps', function() {
  return gulp.src(config.style.deps)
    .pipe(plugins.newer(config.style.dest + '/' + config.style.depsName + '.css'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(config.style.depsName + '.css'))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.style.dest));
});

gulp.task('prod:style:deps', function() {
  return gulp.src(config.style.deps)
    .pipe(plugins.concat(config.style.depsName + '.min.css'))
    .pipe(plugins.minifyCss({processImport: false}))
    .pipe(gulp.dest(config.style.dest));
});


gulp.task('dev:style', ['style:lint'], function() {
  return gulp.src(config.style.entry)
    .pipe(plugins.changed(config.style.dest))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(config.style.autoprefixer))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.style.dest));
});

gulp.task('prod:style', ['style:lint'], function() {
  return gulp.src(config.style.entry)
    .pipe(plugins.changed(config.style.dest))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(config.style.autoprefixer))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename({extname: '.min.css'}))
    .pipe(gulp.dest(config.style.dest));
});


gulp.task('development:style', ['dev:style', 'dev:style:deps']);
gulp.task('production:style', ['prod:style', 'prod:style:deps']);
