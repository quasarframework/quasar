'use strict';

require('../touch/hammer');

var
  customEvents = {},
  gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe']
  ;

Vue.directive('touch', {
  bind: function() {
    if (!this.el.hammer) {
      this.el.hammer = new Hammer.Manager(this.el);
    }

    var mc = this.mc = this.el.hammer;

    // determine event type
    var event = this.arg;
    var recognizerType, recognizer;

    if (customEvents[event]) { // custom event
      var custom = customEvents[event];

      recognizerType = custom.type;
      recognizer = new Hammer[_.capitalize(recognizerType)](custom);
      recognizer.recognizeWith(mc.recognizers);
      mc.add(recognizer);

      return; // EARLY EXIT
    }

    if (!_.includes(gestures, event)) {
      throw new Error('Invalid v-touch event: ' + event);
    }

    recognizer = mc.get(event);
    if (!recognizer) {
      // add recognizer
      recognizer = new Hammer[_.capitalize(event)]();
      // make sure multiple recognizers work together...
      recognizer.recognizeWith(mc.recognizers);
      mc.add(recognizer);
    }
  },

  update: function(fn) {
    var
      mc = this.mc,
      vm = this.vm,
      event = this.arg
      ;

    // teardown old handler
    if (this.handler) {
      mc.off(event, this.handler);
    }

    // define new handler
    this.handler = function(e) {
      e.targetVM = vm;
      fn.call(vm, e);
    };
    mc.on(event, this.handler);
  },

  unbind: function() {
    this.mc.off(this.arg, this.handler);

    if (!_.keys(this.mc.handlers).length) {
      this.mc.destroy();
      this.el.hammer = null;
    }
  }
});

function registerCustomEvent(hammerOptions) {
  customEvents[hammerOptions.event] = hammerOptions;
}

_.merge(q, {
  register: {
    custom: {
      touch: {
        event: registerCustomEvent
      }
    }
  }
});

registerCustomEvent({
  type: 'tap',
  event: 'doubletap',
  taps: 2
});
