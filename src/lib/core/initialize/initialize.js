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
  var body = $('body');

  if (theme === 'ios') {
    body.removeClass('mat').addClass('ios');
  }
  else {
    body.removeClass('ios').addClass('mat');
  }

  quasar.theme = theme;

  $('head link[data-theme]').remove();
  $('head').append('<link data-theme rel="stylesheet" href="css/app.' + theme + '.css">');
}

var
  body = $('body'),
  list = []
  ;

forceTheme(body.hasClass('ios') || quasar.runs.on.ios ? 'ios' : 'mat');

list.push(quasar.runs.on.desktop ? 'desktop' : 'mobile');
list.push(quasar.runs.with.touch ? 'touch' : 'no-touch');

if (quasar.runs.within.iframe) {
  list.push('within-iframe');
}

if (quasar.runs.on.cordova) {
  list.push('cordova');
}

body.addClass(list.join(' '));

/*
 * Inject Globals
 */
require('../events/events');

/*
 * Capture errors
 */
window.onerror = function(message, source, lineno, colno, error) {
  quasar.events.trigger('app:error', {
    message: message,
    source: source,
    lineno: lineno,
    colno: colno,
    error: error
  });
};

/*
 * Inject $quasar variable into Vue
 */
Vue.prototype.$quasar = quasar;

$.extend(true, quasar, {
  events: quasar.create.events.emitter(),
  page: {},
  data: {},
  current: {},
  stores: {},
  swap: {
    theme: function() {
      forceTheme($('body').hasClass('ios') ? 'mat' : 'ios');
    }
  }
});
