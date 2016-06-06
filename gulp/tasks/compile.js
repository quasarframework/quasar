'use strict';

['js', 'css'].forEach(function(type) {
  gulp.task(type + ':lint', function() {
    return gulp.src(config.lint[type])
      .pipe(plugins.pipes[type].lint({
        fail: config.bailOnError
      }));
  });
});

/*
 * JS
 */

function compile(production) {
  var pipe = gulp.src(config.js.src)
    .pipe(plugins.pipes.js.compile({
      prod: production,
      pack: config.js.webpack,
      define: config.js.define
    }));

  if (config.bailOnError) {
    pipe.on('error', function() {
      process.exit(1);
    });
  }

  return pipe.pipe(plugins.rename('quasar.' + (production ? 'min.' : '') + 'js'))
    .pipe(gulp.dest(config.js.dest));
}

gulp.task('js:dev', ['js:lint'], function() {
  return compile();
});

gulp.task('js:prod', ['js:lint'], function() {
  return compile(true);
});

/*
 * CSS
 */

var themes = Object.keys(config.css.themes);

gulp.task('css', ['css:lint', 'css:lib'].concat(themes.map(function(theme) {
  return 'css:' + theme;
})));

gulp.task('css:lib', function() {
  return gulp.src(config.css.lib)
    .pipe(plugins.concat('quasar.lib.styl'))
    .pipe(gulp.dest(config.css.dest));
});

themes.forEach(function(theme) {
  gulp.task('css:' + theme, function() {
    return gulp.src(config.css.themes[theme])
      .pipe(plugins.concat('quasar.' + theme + '.styl'))
      .pipe(gulp.dest(config.css.dest));
  });
});
