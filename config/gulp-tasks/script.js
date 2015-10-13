'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  named = require('vinyl-named'),
  webpack = require('webpack'),
  stream = require('webpack-stream');

gulp.task('script:lint', function() {
  return gulp.src(config.script.watch)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});


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
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.script.dest));
});


gulp.task('dev:script', ['script:lint'], function() {
  return gulp.src(config.script.entry)
    .pipe(named())
    .pipe(stream(config.script.webpack.dev, webpack))
    .pipe(gulp.dest(config.script.dest));
});

gulp.task('prod:script', ['script:lint'], function() {
  return gulp.src(config.script.entry)
    .pipe(named())
    .pipe(stream(config.script.webpack.prod, webpack))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(gulp.dest(config.script.dest));
});

gulp.task('development:script', ['dev:script', 'dev:script:deps']);
gulp.task('production:script', ['prod:script', 'prod:script:deps']);
