'use strict';

module.exports = function(type, manifest) {
  q.clear[type].css();

  if (manifest && manifest.css) {
    q.inject[type].css(manifest.css);
  }
};
