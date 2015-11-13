'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

gulp.task('js:lint', function() {
  return gulp.src(config.js.all)
    .pipe(plugins.pipes.js.lint());
});


function compileJs(production) {
  return gulp.src(config.js.entry)
    .pipe(plugins.pipes.js.compile({
      prod: production,
      extmin: production,
      pack: config.js.webpack
    }))
    .pipe(plugins.injectVersion())
    .pipe(gulp.dest(config.js.dest));
}

gulp.task('dev:js', ['js:lint'], function() {
  return compileJs(false);
});

gulp.task('prod:js', ['js:lint'], function() {
  return compileJs(true);
});

gulp.task('development:js', ['dev:js', 'dev:js:deps']);
gulp.task('production:js', ['prod:js', 'prod:js:deps']);
