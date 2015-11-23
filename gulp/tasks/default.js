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
    ['build:dev', 'build:prod'],
    done
  );
});

gulp.task('build:dev', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    [
      'build:deps:js:dev', 'build:deps:css:dev',
      'build:copy', 'build:preprocess', 'build:semantic'
    ],
    done
  );
});
gulp.task('build:prod', ['clean', 'js:lint', 'css:lint'], function(done) {
  runSequence(
    [
      'build:deps:js:prod', 'build:deps:css:prod',
      'build:copy', 'build:preprocess', 'build:semantic'
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

gulp.task('build:copy', function() {
  return gulp.src(config.build.lib.src)
    .pipe(gulp.dest(config.build.lib.dest));
});
