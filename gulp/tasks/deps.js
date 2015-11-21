'use strict';

var
  _ = require('lodash'),
  fs = require('fs'),
  fse = require('fs-extra')
  ;

function mapToNodeModules(list, min, suffix) {
  return _.map(list, function(item) {
    if (min && !fs.existsSync('node_modules/' + item + '.' + (min ? 'min.' : '') + suffix)) {
      return 'node_modules/' + item + '.' + suffix;
    }
    return 'node_modules/' + item + '.' + (min ? 'min.' : '') + suffix;
  });
}

function compile(production, type, deps, dest) {
  return gulp.src(mapToNodeModules(deps, production, type))
    .pipe(plugins.pipes[type].deps({
      prod: type !== 'css' ? production : false,
      name: config.deps.name + (production ? '.min' : '')
    }))
    .pipe(gulp.dest(config.deps[dest].dest));
}


gulp.task('build:deps:js:dev', function() {
  return compile(false, 'js', config.deps.core.js, 'core');
});
gulp.task('build:deps:js:prod', function() {
  return compile(true, 'js', config.deps.core.js, 'core');
});

gulp.task('build:deps:css:dev', function() {
  return compile(false, 'css', config.deps.core.css, 'core');
});
gulp.task('build:deps:css:prod', function() {
  return compile(true, 'css', config.deps.core.css, 'core');
});


gulp.task('full:deps:js:dev', function() {
  return compile(false, 'js', config.deps.core.js.concat(config.deps.semantic), 'full');
});
gulp.task('full:deps:js:prod', function() {
  return compile(true, 'js', config.deps.core.js.concat(config.deps.semantic), 'full');
});

gulp.task('full:deps:css:dev', function() {
  return compile(false, 'css', config.deps.core.css.concat(config.deps.semantic), 'full');
});
gulp.task('full:deps:css:prod', function() {
  return compile(true, 'css', config.deps.core.css.concat(config.deps.semantic), 'full');
});

gulp.task('build:semantic', function(done) {
  fse.copy(
    config.build.semantic.src + '/themes',
    config.build.semantic.dest + '/themes',
    function() {
      fse.copy(
        config.build.semantic.src + '/components',
        config.build.semantic.dest,
        done
      );
    }
  );
});
