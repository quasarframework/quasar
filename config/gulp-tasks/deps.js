'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

/**
 * Scripts
 */

function compileJs(production) {
  return gulp.src(config.js.deps)
    .pipe(plugins.pipes.js.deps({
      prod: production,
      extmin: production,
      name: config.js.depsName
    }))
    .pipe(gulp.dest(config.js.dest));
}

gulp.task('dev:js:deps', function() {
  return compileJs(false);
});

gulp.task('prod:js:deps', function() {
  return compileJs(true);
});


/**
 * Styles
 */

function compileCss(production) {
  return gulp.src(config.css.deps)
    .pipe(plugins.pipes.css.deps({
      prod: production,
      extmin: production,
      name: config.css.depsName
    }))
    .pipe(gulp.dest(config.css.dest));
}

gulp.task('dev:css:deps', function() {
  return compileCss(false);
});

gulp.task('prod:css:deps', function() {
  return compileCss(true);
});
