'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

/**
 * Scripts
 */
gulp.task('dev:js:deps', function() {
  return gulp.src(config.js.deps)
    .pipe(plugins.newer(config.js.dest + '/' + config.js.depsName + '.js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(config.js.depsName + '.js'))
    .pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.js.dest));
});

gulp.task('prod:js:deps', function() {
  return gulp.src(config.js.deps)
    .pipe(plugins.newer(config.js.dest + '/' + config.js.depsName + '.min.js'))
    .pipe(plugins.concat(config.js.depsName + '.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.js.dest));
});


/**
 * Styles
 */
gulp.task('dev:css:deps', function() {
  return gulp.src(config.css.deps)
    .pipe(plugins.newer(config.css.dest + '/' + config.css.depsName + '.css'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(config.css.depsName + '.css'))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.css.dest));
});

gulp.task('prod:css:deps', function() {
  return gulp.src(config.css.deps)
    .pipe(plugins.concat(config.css.depsName + '.min.css'))
    .pipe(plugins.csso())
    .pipe(gulp.dest(config.css.dest));
});
