'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

/**
 * Scripts
 */
gulp.task('dev:script:deps', function() {
  return gulp.src(config.script.deps)
    .pipe(plugins.newer(config.script.dest + '/' + config.script.depsName + '.js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(config.script.depsName + '.js'))
    .pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.script.dest));
});

gulp.task('prod:script:deps', function() {
  return gulp.src(config.script.deps)
    .pipe(plugins.newer(config.script.dest + '/' + config.script.depsName + '.min.js'))
    .pipe(plugins.concat(config.script.depsName + '.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.script.dest));
});


/**
 * Styles
 */
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
