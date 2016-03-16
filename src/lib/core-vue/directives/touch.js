'use strict';

var
  customEvents = {},
  gestures = ['pan', 'pinch', 'press', 'rotate', 'swipe']
  ;

/* istanbul ignore next */
function decodeEvent(event) {
  if (event.indexOf('-') === -1) {
    return [event, null];
  }

  var direction = event.split('-');

  event = direction.shift();
  direction = direction[0] === 'x' ? Hammer.DIRECTION_HORIZONTAL : Hammer.DIRECTION_VERTICAL;

  return [event, direction];
}

/* istanbul ignore next */
Vue.directive('touch', {
  bind: function() {
    if (!quasar.runs.with.touch) {
      return;
    }
    if (!this.el.hammer) {
      this.el.hammer = new Hammer.Manager(this.el);
    }

    var mc = this.mc = this.el.hammer;

    // determine event type
    var
      decodedEvent = decodeEvent(this.arg),
      event = decodedEvent[0],
      direction = decodedEvent[1],
      recognizerType, recognizer
      ;

    if (customEvents[event]) { // custom event
      var custom = customEvents[event];

      recognizerType = custom.type;
      recognizer = new Hammer[quasar.capitalize(recognizerType)](custom);
      recognizer.recognizeWith(mc.recognizers);
      mc.add(recognizer);

      return; // EARLY EXIT
    }

    if (!gestures.includes(event)) {
      throw new Error('Invalid v-touch event: ' + event);
    }

    recognizer = mc.get(event);
    if (recognizer) {
      if (!direction || recognizer.options.direction === direction) {
        return;
      }
    }

    // add recognizer
    recognizer = new Hammer[quasar.capitalize(event)]();
    if (direction) {
      recognizer.options.direction = direction;
    }
    // make sure multiple recognizers work together...
    recognizer.recognizeWith(mc.recognizers);
    mc.add(recognizer);
  },

  update: function(fn) {
    if (!quasar.runs.with.touch) {
      return;
    }
    var
      mc = this.mc,
      vm = this.vm,
      event = decodeEvent(this.arg)[0]
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
    if (!quasar.runs.with.touch) {
      return;
    }
    this.mc.off(decodeEvent(this.arg)[0], this.handler);

    if (Object.keys(this.mc.handlers).length === 0) {
      this.mc.destroy();
      this.el.hammer = null;
    }
  }
});

/* istanbul ignore next */
function registerCustomEvent(hammerOptions) {
  customEvents[hammerOptions.event] = hammerOptions;
}

$.extend(true, quasar, {
  register: {
    custom: {
      touch: {
        event: registerCustomEvent
      }
    }
  }
});
