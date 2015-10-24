'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  nib = require('nib')
  ;

gulp.task('style:lint', function() {
  return gulp.src(config.style.watch)
    .pipe(plugins.stylint())
    .pipe(plugins.stylint.reporter());
});

gulp.task('dev:style', ['style:lint'], function() {
  return gulp.src(config.style.entry)
    .pipe(plugins.changed(config.style.dest))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus({
      use: [nib()]
    }))
    .pipe(plugins.autoprefixer(config.style.autoprefixer))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.style.dest))
    .pipe(config.browser.stream());
});

gulp.task('prod:style', ['style:lint'], function() {
  return gulp.src(config.style.entry)
    .pipe(plugins.changed(config.style.dest))
    .pipe(plugins.stylus({
      use: [nib()]
    }))
    .pipe(plugins.autoprefixer(config.style.autoprefixer))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename({extname: '.min.css'}))
    .pipe(gulp.dest(config.style.dest));
});


gulp.task('development:style', ['dev:style', 'dev:style:deps']);
gulp.task('production:style', ['prod:style', 'prod:style:deps']);
