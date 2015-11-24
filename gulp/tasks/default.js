'use strict';

var
  runSequence = require('run-sequence'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(config.clean);
});

gulp.task('default', ['build', 'full']);

/*
 * Build
 */

gulp.task('build', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    ['minimal:dev', 'minimal:prod'],
    done
  );
});

gulp.task('minimal:dev', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    [
      'minimal:deps:js:dev', 'minimal:deps:css:dev',
      'minimal:copy', 'minimal:js:preprocess', 'minimal:semantic'
    ],
    done
  );
});
gulp.task('minimal:prod', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    [
      'minimal:deps:js:prod', 'minimal:deps:css:prod',
      'minimal:copy', 'minimal:js:preprocess', 'minimal:semantic'
    ],
    done
  );
});

/*
 * Full
 */

gulp.task('full', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    ['full:dev', 'full:prod'],
    done
  );
});

gulp.task('full:dev', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    [
      'full:deps:js:dev', 'full:deps:css:dev',
      'full:js:dev', 'full:css:dev'
    ],
    done
  );
});

gulp.task('full:prod', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    [
      'full:deps:js:prod', 'full:deps:css:prod',
      'full:js:prod', 'full:css:prod'
    ],
    done
  );
});

/*
 * Other tasks
 */

gulp.task('minimal:copy', function() {
  return gulp.src(config.minimal.lib.src)
    .pipe(gulp.dest(config.minimal.lib.dest));
});
