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
q.global = {
  events: q.create.events.emitter()
};

q.page = {};
q.layout = {};
