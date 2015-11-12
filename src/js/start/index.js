'use strict';

require('./initialize');

function startApp() {
  quasar.load.app.manifest(function(err, appManifest) {
    /* istanbul ignore next */
    if (err) {
      throw new Error('Could not load App manifest.');
    }

    require('./register-pages')(appManifest);
    quasar.start.router();
  });
}

module.exports = {
  start: {
    app: startApp
  }
};
