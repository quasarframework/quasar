'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

function compile(production, type) {
  var stream = gulp.src(config.deps[type].src)
    .pipe(plugins.pipes[type].deps({
      prod: production,
      name: config.deps.name
    }))
    .pipe(gulp.dest(config.deps[type].dest));

  return stream;
}

/**
 * Scripts
 */

gulp.task('dev:js:deps', function() {
  return compile(false, 'js');
});

gulp.task('prod:js:deps', function() {
  return compile(true, 'js');
});

/**
 * Styles
 */

gulp.task('dev:css:deps', function() {
  return compile(false, 'css');
});

gulp.task('prod:css:deps', function() {
  return compile(true, 'css');
});

/*
 * Main tasks
 */
gulp.task('dev:deps',  ['dev:js:deps',  'dev:css:deps']);
gulp.task('prod:deps', ['prod:js:deps', 'prod:css:deps']);
