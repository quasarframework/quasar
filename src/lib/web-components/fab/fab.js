'use strict';

require('../icon/icon');
require('../button/button');

var
  fabsNode = $('<div id="__quasar_fabs">'),
  template = require('raw!./fab.html'),

  durationUnit = 100,
  toggleOnDuration = durationUnit,
  toggleOffDuration = 3 * durationUnit
  ;

$('body').append(fabsNode);

function toggleAnimation(el, open, horizontal, done) {
  var
    time = 0,
    offsetY = horizontal ? 0 : 40,
    offsetX = horizontal ? 40 : 0,
    buttons = el.find('.quasar-button')
    ;

  buttons.velocity('stop').velocity(
    {opacity: '0', scaleX: '.4', scaleY: '.4', translateX: offsetX + 'px', translateY: offsetY + 'px'},
    {
      duration: open ? 0 : toggleOffDuration,
      complete: function() {
        if (!open) {
          done();
        }
      }
    }
  );

  if (!open) {
    return;
  }

  buttons.reverse().each(function() {
    $(this).velocity(
      {opacity: '1', scaleX: '1', scaleY: '1', translateX: '0', translateY: '0'},
      {duration: toggleOnDuration, delay: time}
    );
    time += 100;
  });

  setTimeout(done, time + 100);
}

function displayAnimation(el, show, done) {
  var
    oldValue = show ? '0.01' : '1',
    newValue = show ? '1' : '0.01'
    ;

  el
  .velocity('stop')
  .velocity({opacity: oldValue, scaleX: oldValue, scaleY: oldValue}, {duration: 0})
  .velocity(
    {display: 'block', opacity: newValue, scaleX: newValue, scaleY: newValue},
    {
      duration: 2 * durationUnit,
      delay: show ? 5 * durationUnit : 0,
      complete: done
    }
  );
}


var Fab = Vue.extend({
  template: template,
  data: function() {
    return {
      active: false
    };
  },
  transitions: {
    pop: {
      css: false,
      enter: function(el, done) {
        displayAnimation($(el), true, done);
      },
      leave: function(el, done) {
        displayAnimation($(el), false, done);
      }
    },
    toggle: {
      css: false,
      enter: function(el, done) {
        toggleAnimation($(el), true, this.cfg.horizontal, done);
      },
      leave: function(el, done) {
        toggleAnimation($(el), false, this.cfg.horizontal, done);
      }
    }
  },
  props: ['cfg'],
  methods: {
    toggle: function() {
      if (this.cfg.fn) {
        this.cfg.fn();
        return;
      }

      this.active = !this.active;
    },
    execute: function(action) {
      this.active = !this.active;

      setTimeout(function() {
        if (action.fn) {
          action.fn();
        }
      }, toggleOffDuration + 50);
    }
  }
});

var vm = new Vue({
  el: fabsNode[0],
  replace: false,
  template: '<quasar-fab v-for="fab in fabs" :cfg="fab"></quasar-fab>',
  data: {
    fabs: []
  },
  components: {
    'quasar-fab': Fab
  },
  ready: function() {
    var el = $(this.$el);

    this.gc = {
      marginalsHeightChanged: function() {
        var footer = $('.quasar-footer');

        el.css('margin-bottom', (footer.length > 0 ? 10 + footer.height() : 0) + 'px');
      }
    };
    quasar.events.on('app:page:ready app:layout:update', this.gc.marginalsHeightChanged);
  },
  destroyed: function() {
    quasar.events.off('app:page:ready app:layout:update', this.gc.marginalsHeightChanged);
  }
});


function validate(fab) {
  if (!fab) {
    throw new Error('Please specify FAB config.');
  }
  if (!fab.icon) {
    throw new Error('Please specify FAB icon.');
  }
  if (fab.buttons) {
    _.forEach(fab.buttons, function(button, index) {
      if (!button.icon) {
        throw new Error('Missing icon for FAB ' + fab.icon + ' mini-button at index ' + index);
      }
      if (!button.fn) {
        throw new Error('Missing fn for FAB ' + fab.icon + ' mini-button at index ' + index);
      }
      if (!_.isFunction(button.fn)) {
        throw new Error('fn for FAB ' + fab.icon + ' mini-button at index ' + index + ' is not a function.');
      }
    });
  }
  else if (fab.fn) {
    if (!_.isFunction(fab.fn)) {
      throw new Error('FAB fn is not a function.');
    }
  }
  else {
    throw new Error('Please specify either an action or list of actions.');
  }
}

function addFab(fab) {
  validate(fab);
  vm.$data.fabs.push(fab);
}

function getFab(index) {
  return vm.$data.fabs[index];
}

function removeFab(index) {
  vm.$data.fabs.$remove(index);
}

function removeAllFabs() {
  vm.$data.fabs = [];
}

quasar.events.on('app:page:post-prepare', removeAllFabs);

_.merge(quasar, {
  add: {
    fab: addFab
  },
  get: {
    fab: getFab
  },
  remove: {
    fab: removeFab,
    all: {
      fabs: removeAllFabs
    }
  }
});
