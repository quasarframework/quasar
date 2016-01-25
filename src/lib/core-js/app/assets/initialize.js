'use strict';

require('../../events/events');

/*
 * Inject FastClick
 */
/* eslint-disable no-undef */
FastClick.attach(document.body);
/* eslint-enable no-undef */

/*
 * Inject Globals
 */
_.merge(quasar, {
  events: quasar.create.events.emitter(),
  page: {},
  layout: {},
  data: {}
});
