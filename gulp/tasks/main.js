var gulp = require('gulp'),
    config = require('../config'),
    runSequence = require('run-sequence');

gulp.task('default', ['preview']);

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        ['dev', 'prod'],
        'banner',
        callback
    );
});

gulp.task('dev', ['development:style', 'development:script']);
gulp.task('prod', ['production:style', 'production:script']);

gulp.task('dist', function(callback) {
    runSequence(
        'build',
        'dist:clean',
        'dist:copy',
        callback
    );
});

gulp.task('preview', function(callback) {
    runSequence(
        'preview:build',
        'preview:serve',
        callback
    );
});