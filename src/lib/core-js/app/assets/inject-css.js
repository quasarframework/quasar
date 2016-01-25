'use strict';

module.exports = function(type, manifest) {
  quasar.clear[type].css();

  if (manifest && manifest.css) {
    quasar.inject[type].css(manifest.css);
  }
};
