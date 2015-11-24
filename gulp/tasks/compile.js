'use strict';

function compile(options) {
  return gulp.src(options.src)
    .pipe(plugins.pipes[options.type].compile({
      prod: options.production,
      extmin: options.production,
      pack: config.js.webpack
    }))
    .pipe(gulp.dest(options.dest));
}

/*
 * Javascript
 */

gulp.task('js:lint', function() {
  return gulp.src(config.js.all)
    .pipe(plugins.pipes.js.lint());
});

gulp.task('full:js:dev', ['js:lint', 'full:js:preprocess'], function() {
  return compile({
    type: 'js',
    src: config.minimal.lib.dest + '/quasar.full.js',
    dest: config.full.lib.dest
  });
});
gulp.task('full:js:prod', ['js:lint', 'full:js:preprocess'], function() {
  return compile({
    type: 'js',
    production: true,
    src: config.minimal.lib.dest + '/quasar.full.js',
    dest: config.full.lib.dest
  });
});


/*
 * CSS
 */

gulp.task('css:lint', function() {
  return gulp.src(config.css.all)
    .pipe(plugins.pipes.css.lint());
});

gulp.task('full:css:dev', ['full:css:preprocess'], function() {
  compile({
    type: 'css',
    src: config.minimal.lib.dest + '/quasar.full.styl',
    dest: config.full.lib.dest
  });
});
gulp.task('full:css:prod', ['full:css:preprocess'], function() {
  compile({
    type: 'css',
    production: true,
    src: config.minimal.lib.dest + '/quasar.full.styl',
    dest: config.full.lib.dest
  });
});
