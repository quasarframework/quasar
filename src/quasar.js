'use strict';

window.quasar = {
  VERSION: __QUASAR_VERSION__
};

function requireAll(r) {
  r.keys().forEach(r);
}
requireAll(require.context('./lib', true, /\.js$/));
