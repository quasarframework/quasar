
// Initialize global quasar object
var quasar = window.quasar = window.q = {};

quasar.utils = require('./core/utils');
quasar.debug = require('./core/debug');
_.extend(quasar, require('./core/environment'));
_.extend(quasar, require('./core/router'));
