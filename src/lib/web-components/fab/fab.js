'use strict';

require('../icon/icon');
require('../button/button');

var
  fabsNode = $('<div id="__quasar_fabs">'),
  template = require('raw!./fab.html'),
  animationDuration = 100
  ;

$('body').append(fabsNode);

function toggle(fab, el, done) {
  var
    time = 0,
    offsetY = fab.horizontal ? 0 : 40,
    offsetX = fab.horizontal ? 40 : 0,
    buttons = el.find('ul .quasar-button'),
    open = !fab.active
    ;

  if (open) {
    if (_.isFunction(fab.fn)) {
      fab.fn();
      return;
    }

    fab.active = true;
  }

  buttons.velocity('stop', true).velocity(
    {opacity: '0', scaleX: '.4', scaleY: '.4', translateX: offsetX + 'px', translateY: offsetY + 'px'},
    {
      duration: open ? 0 : animationDuration,
      complete: function() {
        if (!open) {
          fab.active = false;
          done && done();
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
      {duration: animationDuration, delay: time, complete: done}
    );
    time += 100;
  });
}

var vm = new Vue({
  el: fabsNode[0],
  replace: false,
  template: template,
  data: {
    fabs: []
  },
  methods: {
    toggle: function(fab, index) {
      toggle(
        fab,
        getElements(index)
      );
    },
    execute: function(action, fab, index) {
      toggle(
        fab,
        getElements(index),
        function() {
          if (_.isFunction(action.fn)) {
            action.fn();
          }
        }
      );
    }
  }
});


function validate(fab) {
  if (!fab) {
    throw new Error('Please specify FAB config.');
  }
  if (!fab.icon) {
    throw new Error('Please specify FAB icon.');
  }
  if (!fab.fn && !fab.buttons) {
    throw new Error('Please specify either an action or list of actions.');
  }
  if (fab.buttons) {
    _.forEach(fab.buttons, function(button, index) {
      if (!button.icon) {
        throw new Error('Missing icon for FAB ' + fab.icon + ' mini-button at index ' + index);
      }
      if (!button.fn) {
        throw new Error('Missing fn for FAB ' + fab.icon + ' mini-button at index ' + index);
      }
    });
  }
}

function parse(fab) {
  return _.merge({}, fab, {active: false});
}

function getElements(index) {
  var elements = fabsNode.find('> .quasar-fab');

  if (!index) {
    return elements;
  }

  return $(elements[index]);
}

function animateFab(el, show, done) {
  var
    oldValue = show ? '0.1' : '1',
    newValue = show ? '1' : '0.1'
    ;

  el
  .velocity({opacity: oldValue, scaleX: oldValue, scaleY: oldValue}, {duration: 0})
  .velocity(
    {opacity: newValue, scaleX: newValue, scaleY: newValue},
    {
      duration: 3 * animationDuration,
      complete: function() {
        done && done();
      }
    }
  );
}


function addFab(fab) {
  validate(fab);

  setTimeout(function() {
    vm.$data.fabs.push(parse(fab));
    Vue.nextTick(function() {
      animateFab(
        getElements(vm.$data.fabs.length - 1),
        true
      );
    });
  }, 6 * animationDuration);
}

function getFab(index) {
  return vm.$data.fabs[index];
}

function removeFab(index) {
  animateFab(
    getElements(index),
    false,
    function() {
      vm.$data.fabs.$remove(index);
    }
  );
}

function removeAllFabs() {
  animateFab(
    getElements(),
    false,
    function() {
      vm.$data.fabs = [];
    }
  );
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
