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
quasar.global = {
  events: quasar.create.events.emitter()
};

quasar.page = {};
quasar.layout = {};
