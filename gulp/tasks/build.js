'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  runSequence = require('run-sequence'),
  del = require('del')
  ;

gulp.task('clean', function() {
  del.sync(config.clean);
});

gulp.task('build', function(done) {
  return runSequence(
    'clean',
    'build-dev',
    'banner',
    done
  );
});

gulp.task('dist', function(done) {
  return runSequence(
    'clean',
    ['build-dev', 'build-prod'],
    'dist:copy',
    done
  );
});

gulp.task('dist:copy', function() {
  return gulp.src(config.dist.src)
    .pipe(gulp.dest(config.dist.dest));
});

/**
* Helpers
*/
gulp.task('build-dev', ['development:css', 'development:js']);
gulp.task('build-prod', ['production:css', 'production:js']);
