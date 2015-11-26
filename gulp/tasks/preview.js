'use strict';

var spawn = require('child_process').spawn;

function launchPreview(type) {
  spawn('quasar', [type, '-d'], {cwd: config.preview.src, stdio: 'inherit'})
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

gulp.task('preview-resp', ['monitor'], function() {
  launchPreview('preview -r');
});
