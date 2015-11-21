'use strict';

var
  runSequence = require('run-sequence'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(config.clean);
});

gulp.task('default', ['build', 'full']);

gulp.task('build', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    [
      'build:deps:js:dev', 'build:deps:js:prod', 'build:deps:css:dev', 'build:deps:css:prod',
      'build:copy', 'build:preprocess', 'build:semantic'
    ],
    done
  );
});

gulp.task('full', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    [
      'full:deps:js:dev', 'full:deps:js:prod', 'full:deps:css:dev', 'full:deps:css:prod',
      'full:js:dev', 'full:js:prod', 'full:css:dev', 'full:css:prod'
    ],
    done
  );
});

gulp.task('build:copy', function() {
  return gulp.src(config.build.lib.src)
    .pipe(gulp.dest(config.build.lib.dest));
});
