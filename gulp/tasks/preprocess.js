'use strict';

var
  _ = require('lodash'),
  glob = require('glob'),
  preprocess = require('preprocess')
  ;

function requireComponents(type, components) {
  return _.map(components, function(component) {
    component = component.slice(0, type === 'js' ? -3 : -5);
    return type === 'js' ? 'require(\'./lib/' + component + '\');' : '@require \'lib/' + component + '\'';
  }).join('\n');
}

gulp.task('js:preprocess', function(done) {
  var pkg = require('../../package.json');
  var components, core, plugins;

  components = _.map(glob.sync(config.preprocess.dir + '/lib/*/*/*.js'), function(folder) {
    var parts = folder.split('/');

    return parts[parts.length - 3] + '/' + parts[parts.length - 2] + '/' + parts[parts.length - 1];
  });
  core = _.filter(components, function(comp) {
    return _.startsWith(comp, 'core-js/');
  });
  plugins = _.filter(components, function(comp) {
    return !_.startsWith(comp, 'core-js/');
  });

  preprocess.preprocessFile(
    config.preprocess.dir + '/quasar.js',
    config.preprocess.dir + '/' + config.preprocess.file + '.js',
    {
      VERSION: '__VERSION: \'' + pkg.version + '\'',
      COMPONENTS: requireComponents('js', core.concat(plugins)),
    },
    done
  );
});

gulp.task('css:preprocess', function(done) {
  var components;

  components = _.map(glob.sync(config.preprocess.dir + '/lib/*/*/*.styl'), function(folder) {
    var parts = folder.split('/');

    return parts[parts.length - 3] + '/' + parts[parts.length - 2] + '/' + parts[parts.length - 1];
  });

  preprocess.preprocessFile(
    config.preprocess.dir + '/quasar.styl',
    config.preprocess.dir + '/' + config.preprocess.file + '.styl',
    {COMPONENTS: requireComponents('css', components)},
    done
  );
});
