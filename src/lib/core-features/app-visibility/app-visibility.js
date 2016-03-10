'use strict';

var
  body = $('body'),
  hidden = 'hidden'
  ;

function onchange(evt) {
  var
    v = 'visible',
    h = 'hidden',
    state,
    evtMap = {
      focus: v,
      focusin: v,
      pageshow: v,
      blur: h,
      focusout: h,
      pagehide: h
    };

  evt = evt || window.event;

  if (evt.type in evtMap) {
    state = evtMap[evt.type];
  }
  else {
    state = this[hidden] ? h : v;
  }

  quasar.events.trigger('app:' + state, state);
  body.removeClass('app-' + (state === 'visible' ? h : v)).addClass('app-' + state);
}

$(function() {
  // Standards:
  if (hidden in document) {
    document.addEventListener('visibilitychange', onchange);
  }
  else if ((hidden = 'mozHidden') in document) {
    document.addEventListener('mozvisibilitychange', onchange);
  }
  else if ((hidden = 'webkitHidden') in document) {
    document.addEventListener('webkitvisibilitychange', onchange);
  }
  else if ((hidden = 'msHidden') in document) {
    document.addEventListener('msvisibilitychange', onchange);
  }
  // IE 9 and lower:
  else if ('onfocusin' in document) {
    document.onfocusin = document.onfocusout = onchange;
  }
  // All others:
  else {
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if (document[hidden] !== undefined) {
    onchange({type: document[hidden] ? 'blur' : 'focus'});
  }
});
