'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  del = require('del'),
  runSequence = require('run-sequence'),
  named = require('vinyl-named-with-path'),
  webpack = require('webpack'),
  stream = require('webpack-stream'),
  nib = require('nib')
  ;


/**
 * Inject browser property to global config so that
 * tasks are able to trigger browser reload
 */
config.browser = require('browser-sync').create();

function browserReloadAfter(tasks) {
  return function() {
    runSequence(
      tasks,
      function() {
        config.browser.reload();
      }
    );
  };
}

gulp.task('preview:style:lint', function() {
  return gulp.src(config.preview.style.watch)
    .pipe(plugins.stylint())
    .pipe(plugins.stylint.reporter());
});
gulp.task('preview:style', ['preview:style:lint'], function() {
  return gulp.src(config.preview.style.entry)
    .pipe(plugins.changed(config.preview.style.dest))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus({
      use: [nib()]
    }))
    .pipe(plugins.autoprefixer(config.style.autoprefixer))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.preview.style.dest))
    .pipe(config.browser.stream());
});

gulp.task('preview:script:lint', function() {
  return gulp.src(config.preview.script.watch)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});
gulp.task('preview:script', ['preview:script:lint'], function() {
  return gulp.src(config.preview.script.entry)
    .pipe(named())
    .pipe(stream(config.preview.script.webpack, webpack))
    .pipe(gulp.dest(config.preview.script.dest));
});


gulp.task('preview:clean', function() {
  del.sync(config.preview.clean);
});
gulp.task('preview:build', ['preview:script', 'preview:style', 'build-dev']);
gulp.task('preview:serve', function() {
  config.browser.init(config.preview.server, function() {
    // quasar sources
    plugins.watch(config.style.watch, function(files, cb) {
      runSequence('dev:style');
    });
    plugins.watch(config.script.watch, browserReloadAfter('dev:script'));

    // preview sources
    plugins.watch(config.preview.style.watch, function(files, cb) {
      runSequence('preview:style');
    });
    plugins.watch(config.preview.script.watch, browserReloadAfter('preview:script'));
    plugins.watch(config.preview.watch, function() {
      config.browser.reload();
    });
  });
});

gulp.task('preview', function(done) {
  runSequence('clean', 'preview:build', 'preview:serve', done);
});
