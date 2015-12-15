'use strict';

window.quasar = window.q = {};

function requireAll(r) {
  r.keys().forEach(r);
}
requireAll(require.context('./lib', true, /\.js$/));

window.q.boot();
