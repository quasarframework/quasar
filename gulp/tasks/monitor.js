'use strict';

var runSequence = require('run-sequence');

function run(tasks) {
  return function() {
    runSequence(tasks);
  };
}

function watchForChanges() {
  /*
   * Watch for CSS
   */
  plugins.watch(config.css.all, run('css:dev'));

  /*
   * Watch for JS
   */
  plugins.watch(config.js.all, run('js:dev'));

  process.nextTick(function() {
    plugins.util.log();
    plugins.util.log(plugins.util.colors.magenta('Monitoring'), 'Quasar Framework source code for changes...');
    plugins.util.log();
  });
}

gulp.task('monitor', ['dev'], watchForChanges);
