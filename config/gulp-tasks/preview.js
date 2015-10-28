require('../gulp-config').browser = require('browser-sync').create();

/*
'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  del = require('del'),
  runSequence = require('run-sequence'),
  named = require('vinyl-named-with-path'),
  nib = require('nib')
  ;


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

gulp.task('preview:css:lint', function() {
  return gulp.src(config.preview.css.watch)
    .pipe(plugins.stylint())
    .pipe(plugins.stylint.reporter());
});
gulp.task('preview:css', ['preview:css:lint'], function() {
  return gulp.src(config.preview.css.entry)
    .pipe(plugins.changed(config.preview.css.dest))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus({
      use: [nib()]
    }))
    .pipe(plugins.autoprefixer(config.css.autoprefixer))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.preview.css.dest))
    .pipe(config.browser.stream());
});

gulp.task('preview:js:lint', function() {
  return gulp.src(config.preview.js.watch)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});
gulp.task('preview:js', ['preview:js:lint'], function() {
  return gulp.src(config.preview.js.entry)
    .pipe(named())
    .pipe(plugins.webpack(config.preview.js.webpack))
    .pipe(gulp.dest(config.preview.js.dest));
});


gulp.task('preview:clean', function() {
  del.sync(config.preview.clean);
});
gulp.task('preview:build', ['preview:js', 'preview:css', 'build-dev']);
gulp.task('preview:serve', function() {
  config.browser.init(config.preview.server, function() {
    // quasar sources
    plugins.watch(config.css.watch, function(files, cb) {
      runSequence('dev:css');
    });
    plugins.watch(config.js.watch, browserReloadAfter('dev:js'));

    // preview sources
    plugins.watch(config.preview.css.watch, function(files, cb) {
      runSequence('preview:css');
    });
    plugins.watch(config.preview.js.watch, browserReloadAfter('preview:js'));
    plugins.watch(config.preview.watch, function() {
      config.browser.reload();
    });
  });
});

gulp.task('preview', function(done) {
  runSequence('clean', 'preview:build', 'preview:serve', done);
});
*/
