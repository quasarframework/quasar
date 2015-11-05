'use strict';

// Initialize global quasar object
var quasar = window.quasar = window.q = {};

/*
 * Add CORE
 */
_.merge(quasar,
  require('./core/utils'),
  require('./core/debug'),
  require('./core/environment'),
  require('./core/cookie'),
  require('./core/router'),
  require('./core/request'),
  require('./core/storage'),
  require('./core/require'),

  require('./start')
);

/*
 * Load Entry Point
 */
quasar.require.script('js/app');
