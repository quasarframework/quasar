
// Initialize global quasar object
var quasar = window.quasar = window.q = {};

quasar.utils = require('./core/utils');
quasar.debug = require('./core/debug');
_.merge(quasar, require('./core/environment'));
_.merge(quasar, require('./core/cookie'));
_.merge(quasar, require('./core/router'));
_.merge(quasar, require('./core/request/request'));
