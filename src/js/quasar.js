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
  require('./lib/require')
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
  var node = $('#quasar-view[data-entry-point]');

  /* istanbul ignore next */
  if (node.length > 0) {
    quasar.require.script('js/' + node.attr('data-entry-point'));
  }
});
