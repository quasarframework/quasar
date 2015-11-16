'use strict';

var
  fse = require('fs-extra'),
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  _ = require('lodash'),
  path = require('path')
  ;

function mapToNodeModules(suffix, list) {
  return _.map(list, function(item) {
    if (item.indexOf('!') === 0) {
      return item.substr(1) + '.' + suffix;
    }
    return 'node_modules/' + item + '.' + suffix;
  });
}

function compile(production, type) {
  var deps = mapToNodeModules(type, config.deps[type].src);

  var stream = gulp.src(deps)
    .pipe(plugins.pipes[type].deps({
      prod: production,
      extmin: true,
      name: config.deps.name
    }))
    .pipe(gulp.dest(config.deps[type].dest));

  return stream;
}

/**
 * Scripts
 */

gulp.task('dev:js:deps', function() {
  return compile(false, 'js');
});

gulp.task('prod:js:deps', function() {
  return compile(true, 'js');
});

/**
 * Styles
 */

gulp.task('dev:css:deps', function() {
  return compile(false, 'css');
});

gulp.task('prod:css:deps', function() {
  return compile(true, 'css');
});

gulp.task('deps:semantic', function(done) {
  fse.copy(
    'node_modules/quasar-semantic/dist',
    path.join(config.deps.dest, 'semantic'),
    function() {
      done();
    }
  );
});

/*
 * Main tasks
 */
gulp.task('dev:deps',  ['dev:js:deps',  'dev:css:deps']);
gulp.task('prod:deps', ['prod:js:deps', 'prod:css:deps']);
