'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  spawn = require('child_process').spawn
  ;

gulp.task('preview', ['monitor'], function() {
  spawn('quasar', ['preview', '-d'], {cwd: config.preview})
    .on('error', function() {
      console.log();
      console.log('!!! You need quasar-cli installed (npm install -g quasar-cli) !!!');
      console.log();
      process.exit(1);
    })
    .stdout.on('data', function(data) {
      console.log(data.toString());
    });
});
