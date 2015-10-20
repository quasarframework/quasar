
// Initialize global quasar object
var quasar = window.quasar = window.q = {};

quasar.utils = require('./core/utils');
quasar.debug = require('./core/debug');

_.merge(quasar,
  require('./core/environment'),
  require('./core/cookie'),
  require('./core/router'),
  require('./core/request/request'),
  require('./core/storage')
);
