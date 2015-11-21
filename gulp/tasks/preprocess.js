'use strict';

var
  _ = require('lodash'),
  glob = require('glob'),
  preprocess = require('preprocess')
  ;

function requireComponents(components) {
  return _.map(components, function(component) {
    component = component.slice(0, -3);
    return 'require(\'./' + component + '\');';
  }).join('\n');
}

function requireCssComponents(components) {
  return _.map(components, function(component) {
    component = component.slice(0, -5);
    return '@require \'' + component + '\'';
  }).join('\n');
}

gulp.task('build:preprocess', ['build:copy'], function(done) {
  var pkg = require('../../package.json');
  var core = _.map(glob.sync(config.preprocess.core), function(folder) {
    return folder.substring(folder.indexOf('core/'));
  });

  preprocess.preprocessFile(
    config.preprocess.src.js,
    config.build.lib.dest + '/quasar.js',
    {
      VERSION: '__VERSION: \'' + pkg.version + '\'',
      COMPONENTS: requireComponents(core),
      requireStatement: '// @echo requireStatement'
    },
    done
  );
});

gulp.task('full:preprocess', ['build:preprocess'], function(done) {
  var components;

  components = _.map(glob.sync(config.preprocess.full + '.js'), function(folder) {
    var parts = folder.split('/');

    return parts[parts.length - 3] + '/' + parts[parts.length - 2] + '/' + parts[parts.length - 1];
  });
  components = _.filter(components, function(comp) {
    return !_.startsWith(comp, 'core/');
  });

  preprocess.preprocessFile(
    config.build.lib.dest + '/quasar.js',
    config.build.lib.dest + '/quasar.full.js',
    {
      requireStatement: requireComponents(components)
    },
    done
  );
});

gulp.task('full:css:preprocess', ['build:copy'], function(done) {
  var components;

  components = _.map(glob.sync(config.preprocess.full + '.styl'), function(folder) {
    var parts = folder.split('/');

    return parts[parts.length - 3] + '/' + parts[parts.length - 2] + '/' + parts[parts.length - 1];
  });
  components = _.filter(components, function(comp) {
    return !_.endsWith(comp, 'semantic.styl');
  });

  preprocess.preprocessFile(
    config.build.lib.dest + '/quasar.styl',
    config.build.lib.dest + '/quasar.full.styl',
    {
      requireStatement: requireCssComponents(components)
    },
    done
  );
});
