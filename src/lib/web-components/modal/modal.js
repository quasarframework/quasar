'use strict';

var
  target = $('#quasar-app'),
  template = require('raw!./modal.html'),
  duration = 300
  ;

function Modal(vm) {
  if (!vm) {
    throw new Error('Modal needs a VM.');
  }
  if (!vm.template) {
    throw new Error('Modal needs a template.');
  }

  var self = this;

  this.$el = $(template).appendTo(target);
  this.$backdrop = this.$el.find('> .modal-backdrop');
  this.$content = this.$el.find('> .modal-content');

  $.extend(true, vm, {
    el: self.$content[0],
    replace: false,
    methods: {
      close: self.close.bind(self)
    }
  });

  this.vm = new Vue(vm);
  this.__onShowHandlers = [];
  this.__onCloseHandlers = [];
  this.autoDestroy = true;
  this.minimized = false;
  this.maximized = false;
}

Modal.prototype.show = function() {
  if (this.$el.closest('html').length === 0) {
    throw new Error('Modal was previously destroyed. Create another one.');
  }

  if (this.minimized && this.maximized) {
    throw new Error('Modal cannot be minimized & maximized simultaneous.');
  }

  this.$content.removeClass('minimized maximized');
  if (this.minimized) {
    this.$content.addClass('minimized');
  }
  if (this.maximized) {
    this.$content.addClass('maximized');
  }

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
  this.$content.velocity(effect, options);
  if (!this.maximized) {
    this.$backdrop.addClass('active');
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

  this.$backdrop.removeClass('active');
  this.$content.velocity(effect, options);
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

Modal.prototype.css = function(properties) {
  if (properties !== Object(properties)) {
    throw new Error('Modal.css() needs an object as parameter.');
  }

  this.$content.css(properties);
  return this;
};

Modal.prototype.destroy = function() {
  if (this.vm) {
    this.vm.$destroy();
  }
  this.$el.remove();
};

quasar.Modal = Modal;
