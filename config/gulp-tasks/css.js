'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

gulp.task('css:lint', function() {
  return gulp.src(config.css.watch)
    .pipe(plugins.pipes.css.lint());
});

function compile(production) {
  return gulp.src(config.css.entry)
    .pipe(plugins.pipes.css.compile({
      prod: production,
      extmin: production
    }))
    .pipe(gulp.dest(config.css.dest))
    .pipe(config.browser.stream());
}

gulp.task('dev:css', ['css:lint'], function() {
  return compile(false);
});

gulp.task('prod:css', ['css:lint'], function() {
  return compile(true);
});


gulp.task('development:css', ['dev:css', 'dev:css:deps']);
gulp.task('production:css', ['prod:css', 'prod:css:deps']);
