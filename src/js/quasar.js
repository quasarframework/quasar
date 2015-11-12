'use strict';

/*
 * Initialize Quasar Object
 */
var quasar = window.quasar = window.q = {};

/*
 * Generate Quasar
 */
_.merge(quasar,
  require('./lib/utils'),
  require('./lib/debug'),
  require('./lib/environment'),
  require('./lib/cookie'),
  require('./lib/router'),
  require('./lib/ajax-request'),
  require('./lib/storage'),
  require('./lib/require'),
  require('./lib/events')
);

_.merge(quasar,
  require('./procedures/app-manifest')
);

_.merge(quasar,
  require('./start')
);

/*
 * Load Entry Point
 */
$(function() {
  quasar.require.script('js/app');
});
