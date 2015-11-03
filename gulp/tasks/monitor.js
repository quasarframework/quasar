'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  runSequence = require('run-sequence')
  ;

function run(tasks) {
  return function() {
    runSequence(tasks);
  };
}

function watchForChanges() {
  /*
   * Watch for CSS
   */
  plugins.watch(config.css.all, run('dev:css'));

  /*
   * Watch for JS
   */
  plugins.watch(config.js.all, run('dev:js'));

  /*
   * Watch for Deps
   */
  plugins.watch(config.deps.js.src, run('dev:js:deps'));
  plugins.watch(config.deps.css.src, run('dev:css:deps'));
}

gulp.task('monitor', ['build'], watchForChanges);
