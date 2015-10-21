
// Initialize global quasar object
var quasar = window.quasar = window.q = {};

_.merge(quasar,
  require('./core/utils'),
  require('./core/debug'),
  require('./core/environment'),
  require('./core/cookie'),
  require('./core/router'),
  require('./core/request/request'),
  require('./core/storage'),
  require('./core/require')
);
