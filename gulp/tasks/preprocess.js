'use strict';

var
  _ = require('lodash'),
  glob = require('glob'),
  preprocess = require('preprocess')
  ;

function requireComponents(type, components) {
  return _.map(components, function(component) {
    component = component.slice(0, type === 'js' ? -3 : -5);
    return type === 'js' ? 'require(\'./' + component + '\');' : '@require \'' + component + '\'';
  }).join('\n');
}

gulp.task('js:preprocess', function(done) {
  var pkg = require('../../package.json');
  var components, core, plugins;

  components = _.map(glob.sync(config.lib.src + '/*/*/*.js'), function(folder) {
    var parts = folder.split('/');

    return parts[parts.length - 3] + '/' + parts[parts.length - 2] + '/' + parts[parts.length - 1];
  });
  core = _.filter(components, function(comp) {
    return _.startsWith(comp, 'core/');
  });
  plugins = _.filter(components, function(comp) {
    return !_.startsWith(comp, 'core/');
  });

  preprocess.preprocessFile(
    config.lib.src + '/../quasar.js',
    config.lib.dest + '/quasar.js',
    {
      VERSION: '__VERSION: \'' + pkg.version + '\'',
      COMPONENTS: requireComponents('js', core.concat(plugins)),
    },
    done
  );
});

gulp.task('css:preprocess', function(done) {
  var components;

  components = _.map(glob.sync(config.lib.src + '/*/*/*.styl'), function(folder) {
    var parts = folder.split('/');

    return parts[parts.length - 3] + '/' + parts[parts.length - 2] + '/' + parts[parts.length - 1];
  });

  preprocess.preprocessFile(
    config.lib.src + '/../quasar.styl',
    config.lib.dest + '/quasar.styl',
    {COMPONENTS: requireComponents('css', components)},
    done
  );
});
