var
	gulp = require('gulp'),
    config = require('../gulp-config'),
    del = require('del')
;

gulp.task('dist:copy', function() {
    return gulp.src(config.dist.src)
        .pipe(gulp.dest(config.dist.dest));
});

gulp.task('dist:clean', function() {
    del([config.dist.dest]);
});