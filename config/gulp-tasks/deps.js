'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins;

function devDeps(config) {
  return gulp.src(config.src)
    .pipe(plugins.newer(config.dest + '/' + config.name))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat(config.name))
    .pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.dest));
}

/**
 * Scripts
 */
gulp.task('dev:script:deps', function() {
  return devDeps({
    src: config.script.deps,
    dest: config.script.dest,
    name: config.script.depsName + '.js'
  });
});

gulp.task('prod:script:deps', function() {
  return gulp.src(config.script.deps)
    .pipe(plugins.concat(config.script.depsName + '.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.script.dest));
});


/**
 * Styles
 */
gulp.task('dev:style:deps', function() {
  return devDeps({
    src: config.style.deps,
    dest: config.style.dest,
    name: config.style.depsName + '.css'
  });
});

gulp.task('prod:style:deps', function() {
  return gulp.src(config.style.deps)
    .pipe(plugins.concat(config.style.depsName + '.min.css'))
    .pipe(plugins.minifyCss({processImport: false}))
    .pipe(gulp.dest(config.style.dest));
});
