'use strict';

function loadAppManifest(callback) {
  if (!callback) {
    throw new Error('Please provide callback.');
  }

  quasar.make.a.get.request({url: 'app.json', local: true})
    .done(callback);
};

module.exports = {
  load: {
    app: {
      manifest: loadAppManifest
    }
  }
};
