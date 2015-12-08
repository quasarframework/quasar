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

gulp.task('dev', ['deps:js:dev', 'deps:css:dev', 'app:additions', 'js:dev', 'css:dev']);
gulp.task('prod', ['deps:js:prod', 'deps:css:prod', 'app:additions', 'js:prod', 'css:prod']);


gulp.task('app:additions', function() {
  return gulp.src(config.appAdditions.src)
    .pipe(plugins.changed(config.appAdditions.dest))
    .pipe(gulp.dest(config.appAdditions.dest));
});
