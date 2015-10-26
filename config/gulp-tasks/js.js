'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  named = require('vinyl-named')
  ;

gulp.task('js:lint', function() {
  return gulp.src(config.js.watch)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('dev:js', ['js:lint'], function() {
  return gulp.src(config.js.entry)
    .pipe(named())
    .pipe(plugins.webpack(config.js.webpack.dev))
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('prod:js', ['js:lint'], function() {
  return gulp.src(config.js.entry)
    .pipe(named())
    .pipe(plugins.webpack(config.js.webpack.prod))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('development:js', ['dev:js', 'dev:js:deps']);
gulp.task('production:js', ['prod:js', 'prod:js:deps']);
