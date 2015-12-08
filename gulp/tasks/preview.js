'use strict';

var
  runSequence = require('run-sequence'),
  spawn = require('child_process').spawn
  ;

/*
 * Monitor
 */

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
  plugins.watch([config.js.all, config.html.all], run('js:dev'));

  /*
   * Watch App Additions
   */
  plugins.watch(config.appAdditions.src, run('app:additions'));

  process.nextTick(function() {
    plugins.util.log();
    plugins.util.log(plugins.util.colors.magenta('Monitoring'), 'Quasar Framework source code for changes...');
    plugins.util.log();
  });
}

gulp.task('monitor', ['dev'], watchForChanges);

/*
 * Preview
 */

function launch(args, done) {
  args.push('-d');
  spawn('quasar', args, {cwd: config.preview.src, stdio: 'inherit'})
    .on('error', function() {
      console.log('\n!!! You need quasar-cli installed (npm install -g quasar-cli) !!!\n');
      process.exit(1);
    })
    .on('close', function() {
      done();
    });
}

gulp.task('preview', ['monitor'], function(done) {
  launch(['preview'], done);
});

gulp.task('preview-resp', ['monitor'], function(done) {
  launch(['preview', '-r'], done);
});

/*
 * Run Wrapper
 */

gulp.task('wrapper', ['dev'], function(done) {
  console.log(plugins.util.colors.magenta('\nMake sure that you have added at least one platform (quasar wrap platform add <platform-name>).\n'));
  launch(['build'], function() {
    launch(['wrap', 'run'], done);
  });
});
