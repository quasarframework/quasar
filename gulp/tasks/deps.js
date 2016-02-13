'use strict';

var fs = require('fs');

function mapToNodeModules(list, min, suffix) {
  return list.map(function(item) {
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
      prod: production,
      name: name
    }))
    .pipe(gulp.dest(config.deps.dest));
}

['dev', 'prod'].forEach(function(type) {

  gulp.task('deps:js:' + type, function() {
    return compile('js', type === 'prod');
  });
  gulp.task('deps:css:' + type, function() {
    return compile('css', type === 'prod');
  });

});

/*
 * Additions
 */

var appAdditionsTasks = [];

config.appAdditions.assets.forEach(function(entry, number) {
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
