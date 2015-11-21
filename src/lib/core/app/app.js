'use strict';

require('../manifests/manifests');
require('../router/router');
require('../debug/debug');
require('./js/initialize');

function startApp() {
  quasar.load.app.manifest(function(err, appManifest) {
    /* istanbul ignore next */
    if (err) {
      throw new Error('Could not load App manifest.');
    }

    require('./js/register-pages')(appManifest);
    quasar.start.router();
  });
}

_.merge(q, {
  start: {
    app: startApp
  }
});
