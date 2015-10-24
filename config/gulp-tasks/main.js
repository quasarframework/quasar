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
  runSequence(
    'clean',
    'build-dev',
    'banner',
    done
  );
});

gulp.task('dist', function(done) {
  runSequence(
    'clean',
    ['build-dev', 'build-prod'],
    'dist:clean',
    'dist:copy',
    done
  );
});


/**
* Helpers
*/
gulp.task('build-dev', ['development:style', 'development:script']);
gulp.task('build-prod', ['production:style', 'production:script']);
