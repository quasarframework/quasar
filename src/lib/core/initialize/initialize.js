'use strict';

/*
 * Inject FastClick
 */
/* eslint-disable no-undef */
FastClick.attach(document.body);
/* eslint-enable no-undef */

/*
 * Inject App CSS based on correct theme
 */
require('../environment/environment');

function forceTheme(theme) {
  if (theme === 'ios') {
    quasar.runs.on.ios = true;
    quasar.runs.on.android = false;
  }
  $('head link[data-theme]').remove();
  $('head').append('<link data-theme rel="stylesheet" href="css/app.' + theme + '.css">');
}

$(function() {
  var
    body = $('body'),
    list = []
    ;

  forceTheme(body.hasClass('ios') || quasar.runs.on.ios ? 'ios' : 'mat');

  list.push(quasar.runs.on.desktop ? 'desktop' : 'mobile');
  list.push(quasar.runs.with.touch ? 'touch' : 'no-touch');

  if (quasar.runs.on.cordova) {
    list.push('cordova');
  }

  body.addClass(list.join(' '));
});

/*
 * Inject Globals
 */
require('../events/events');

$.extend(true, quasar, {
  events: quasar.create.events.emitter(),
  page: {},
  layout: {},
  data: {},
  force: {
    theme: forceTheme
  }
});
