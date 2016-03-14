'use strict';

var
  target = $('#quasar-app'),
  duration = 300
  ;

function Modal(vm) {
  if (!vm) {
    throw new Error('Modal needs a VM.');
  }
  if (!vm.template) {
    throw new Error('Modal needs a template.');
  }

  var
    self = this,
    overlay = $('<div class="overlay">').appendTo(target),
    element = $('<div class="modal hidden window-height window-width fullscreen">').appendTo(target)
    ;

  $.extend(true, vm, {
    el: element[0],
    replace: false,
    methods: {
      close: self.close.bind(self)
    }
  });

  this.vm = new Vue(vm);
  this.$el = element;
  this.$overlay = overlay;
  this.__onShowHandlers = [];
  this.__onCloseHandlers = [];
  this.autoDestroy = true;
  this.alwaysFullscreen = false;
}

Modal.prototype.show = function() {
  if (this.$el.closest('html').length === 0) {
    throw new Error('Modal was previously destroyed. Create another one.');
  }

  this.$el[this.alwaysFullscreen ? 'addClass' : 'removeClass']('always-fullscreen');

  var
    self = this,
    effect = quasar.runs.on.ios ? {translateY: [0, '101%']} : 'transition.slideUpIn',
    options = {
      duration: duration,
      complete: function() {
        self.__onShowHandlers.forEach(function(handler) {
          handler();
        });
      }
    };

  this.$el.removeClass('hidden');
  this.$el.velocity(effect, options);
  if (!this.alwaysFullscreen) {
    this.$overlay.addClass('active');
  }
  return this;
};

Modal.prototype.close = function() {
  var
    self = this,
    effect = quasar.runs.on.ios ? {translateY: ['101%', 0]} : 'transition.slideDownOut',
    options = {
      duration: duration,
      complete: function() {
        if (self.autoDestroy) {
          self.destroy();
        }
        self.__onCloseHandlers.forEach(function(handler) {
          handler();
        });
      }
    };

  if (!this.alwaysFullscreen) {
    this.$overlay.removeClass('active');
  }
  this.$el.velocity(effect, options);
};

['onShow', 'onClose'].forEach(function(event) {
  Modal.prototype[event] = function(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Modal ' + event + ' handler must be a function.');
    }

    this['__' + event + 'Handlers'].push(handler);
    return this;
  };
});

Modal.prototype.set = function(properties) {
  if (properties !== Object(properties)) {
    throw new Error('Modal.set() needs an object as parameter.');
  }

  Object.keys(properties).forEach(function(property) {
    this[property] = properties[property];
  }.bind(this));

  return this;
};

Modal.prototype.destroy = function() {
  this.$el.remove();
  this.$overlay.remove();
};

quasar.Modal = Modal;
