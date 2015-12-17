'use strict';

var
  _ = require('lodash'),
  fs = require('fs')
  ;

function mapToNodeModules(list, min, suffix) {
  return _.map(list, function(item) {
    if (min && !fs.existsSync('node_modules/' + item + '.min.' + suffix)) {
      return 'node_modules/' + item + '.' + suffix;
    }
    return 'node_modules/' + item + '.' + (min ? 'min.' : '') + suffix;
  });
}

function compile(type, production) {
  var name = config.deps.name + (production ? '.min' : '');

  return gulp.src(mapToNodeModules(config.deps[type], production, type))
    .pipe(plugins.newer(config.deps.dest + '/' + name + '.' + type))
    .pipe(plugins.pipes[type].deps({
      prod: type !== 'css' && production,
      name: name
    }))
    .pipe(gulp.dest(config.deps.dest));
}

gulp.task('deps:js:dev', function() {
  return compile('js');
});
gulp.task('deps:js:prod', function() {
  return compile('js', true);
});

gulp.task('deps:css:dev', function() {
  return compile('css');
});
gulp.task('deps:css:prod', function() {
  return compile('css', true);
});


/*
 * Additions
 */

var appAdditionsTasks = [];

_.forEach(config.appAdditions.assets, function(entry, number) {
  var taskName = 'app:additions:' + number;

  appAdditionsTasks.push(taskName);
  gulp.task(taskName, function() {
    var dest = config.appAdditions.dest + entry.dest;

    return gulp.src(entry.src)
      .pipe(plugins.changed(dest))
      .pipe(gulp.dest(dest));
  });
});

gulp.task('app:additions', appAdditionsTasks);
