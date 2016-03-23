'use strict';

var del = require('del');

gulp.task('clean', function() {
  del.sync(config.clean);
});

gulp.task('default', ['dist']);

gulp.task('dist', ['dev', 'prod']);

gulp.task('dev', ['deps:js:dev', /*'deps:css:dev',*/ 'app:additions', 'js:dev', 'css']);
gulp.task('prod', ['deps:js:prod', /*'deps:css:prod',*/ 'app:additions', 'js:prod', 'css']);
