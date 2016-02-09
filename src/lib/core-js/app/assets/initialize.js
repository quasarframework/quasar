'use strict';

require('../../events/events');

/*
 * Inject FastClick
 */
/* eslint-disable no-undef */
FastClick.attach(document.body);
/* eslint-enable no-undef */

/*
 * Inject Address Bar color
 */
var color, div = $('<div class="background primary">');

$('body').append(div);
color = div.css('background-color');
div.remove();

$('head')
  .append('<meta name="theme-color" content="' + color + '">')
  .append('<meta name="msapplication-navbutton-color" content="' + color + '">')
  .append('<meta name="apple-mobile-web-app-status-bar-style" content="' + color + '">');

/*
 * Inject Globals
 */
_.merge(quasar, {
  events: quasar.create.events.emitter(),
  page: {},
  layout: {},
  data: {}
});
