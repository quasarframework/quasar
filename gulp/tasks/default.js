'use strict';

var
  runSequence = require('run-sequence'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(config.clean);
});

gulp.task('default', ['dist']);

gulp.task('dist', ['clean'], function(done) {
  runSequence(
    ['dev', 'prod'],
    done
  );
});

gulp.task('dev', ['deps:js:dev', 'deps:css:dev', 'js:dev', 'css:dev']);
gulp.task('prod', ['deps:js:prod', 'deps:css:prod', 'js:prod', 'css:prod']);
