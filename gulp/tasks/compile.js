'use strict';

function compile(type, production) {
  return gulp.src(config[type].src)
    .pipe(plugins.pipes[type].compile({
      prod: production,
      extmin: production,
      pack: config.js.webpack
    }))
    .pipe(gulp.dest(config[type].dest));
}

/*
 * Javascript
 */

gulp.task('js:lint', function() {
  return gulp.src(config.js.all)
    .pipe(plugins.pipes.js.lint());
});

gulp.task('js:dev', ['js:lint', 'js:preprocess', 'copy:source'], function() {
  return compile('js');
});
gulp.task('js:prod', ['js:lint', 'js:preprocess', 'copy:source'], function() {
  return compile('js', true);
});


/*
 * CSS
 */

gulp.task('css:lint', function() {
  return gulp.src(config.css.all)
    .pipe(plugins.pipes.css.lint());
});

gulp.task('css:dev', ['css:lint', 'css:preprocess', 'copy:source'], function() {
  return compile('css');
});
gulp.task('css:prod', ['css:lint', 'css:preprocess', 'copy:source'], function() {
  return compile('css', true);
});

/*
 * Helper tasks
 */

gulp.task('copy:source', function() {
  return gulp.src(config.lib.src + '/**/*')
    .pipe(plugins.changed(config.lib.dest))
    .pipe(gulp.dest(config.lib.dest));
});
