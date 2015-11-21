'use strict';

require('../ajax/ajax');

function loadAppManifest(callback) {
  if (!callback) {
    throw new Error('Please provide callback.');
  }

  quasar.make.a.get.request({url: 'app.json', local: true})
    .fail(function() {
      callback(1);
    })
    .done(function(data) {
      callback(null, data);
    });
};

_.merge(q, {
  load: {
    app: {
      manifest: loadAppManifest
    }
  }
});
