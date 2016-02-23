'use strict';

/*
 * Scripts
 */

function compile(production) {
  return gulp.src(config.js.src)
    .pipe(plugins.pipes.js.compile({
      prod: production,
      pack: config.js.webpack
    }))
    .pipe(plugins.rename('quasar.' + (production ? 'min.' : '') + 'js'))
    .pipe(gulp.dest(config.js.dest));
}

['js', 'css'].forEach(function(type) {
  gulp.task(type + ':lint', function() {
    return gulp.src(config.lint[type])
      .pipe(plugins.pipes[type].lint());
  });
});

gulp.task('js:dev', ['js:lint'], function() {
  return compile();
});

gulp.task('js:prod', ['js:lint'], function() {
  return compile(true);
});

gulp.task('css', ['css:lint'], function() {
  return gulp.src(config.css.src)
    .pipe(plugins.newer(config.css.dest))
    .pipe(gulp.dest(config.css.dest));
});
