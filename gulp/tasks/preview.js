'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  spawn = require('child_process').spawn
  ;

function launchPreview(type) {
  spawn('quasar', [type, '-d'], {cwd: config.preview, stdio: 'inherit'})
    .on('error', function() {
      console.log();
      console.log('!!! You need quasar-cli installed (npm install -g quasar-cli) !!!');
      console.log();
      process.exit(1);
    });
}

gulp.task('preview', ['monitor'], function() {
  launchPreview('preview');
});

gulp.task('rpreview', ['monitor'], function() {
  launchPreview('rpreview');
});
