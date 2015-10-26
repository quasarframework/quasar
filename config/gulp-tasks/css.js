'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  nib = require('nib')
  ;

gulp.task('css:lint', function() {
  return gulp.src(config.css.watch)
    .pipe(plugins.stylint())
    .pipe(plugins.stylint.reporter());
});

gulp.task('dev:css', ['css:lint'], function() {
  return gulp.src(config.css.entry)
    .pipe(plugins.changed(config.css.dest))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus({
      use: [nib()]
    }))
    .pipe(plugins.autoprefixer(config.css.autoprefixer))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.css.dest))
    .pipe(config.browser.stream());
});

gulp.task('prod:css', ['css:lint'], function() {
  return gulp.src(config.css.entry)
    .pipe(plugins.changed(config.css.dest))
    .pipe(plugins.stylus({
      use: [nib()]
    }))
    .pipe(plugins.autoprefixer(config.css.autoprefixer))
    .pipe(plugins.csso())
    .pipe(plugins.rename({extname: '.min.css'}))
    .pipe(gulp.dest(config.css.dest));
});


gulp.task('development:css', ['dev:css', 'dev:css:deps']);
gulp.task('production:css', ['prod:css', 'prod:css:deps']);
