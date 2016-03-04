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

$(function() {
  if ($('body').hasClass('ios')) {
    quasar.runs.on.ios = true;
  }

  var theme = quasar.runs.on.ios ? 'ios' : 'mat';

  $('head').append('<link data-theme rel="stylesheet" href="css/app.' + theme + '.css">');
});

function forceTheme(theme) {
  if (theme === 'ios') {
    quasar.runs.on.ios = true;
  }
  $('head link[data-theme]').remove();
  $('head').append('<link data-theme rel="stylesheet" href="css/app.' + theme + '.css">');
}

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
