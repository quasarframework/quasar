'use strict';

var
  runSequence = require('run-sequence'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(config.clean);
});

gulp.task('default', ['dist']);

gulp.task('dist', ['dev', 'prod']);

gulp.task('dev', ['deps:js:dev', 'deps:css:dev', 'deps:css:semantic', 'js:dev', 'css:dev']);
gulp.task('prod', ['deps:js:prod', 'deps:css:prod', 'deps:css:semantic', 'js:prod', 'css:prod']);
