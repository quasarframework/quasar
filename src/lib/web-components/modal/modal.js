'use strict';

var
  target = $('#quasar-app'),
  template = require('raw!./modal.html'),
  duration = 300
  ;

function Modal(vmObject) {
  var vm = $.extend({}, vmObject);

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
  this.selfDestroy = true;
}

Modal.prototype.show = function(onShow) {
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
    effect,
    self = this,
    options = {
      duration: duration,
      complete: function() {
        self.__onShowHandlers.forEach(function(handler) {
          handler();
        });
        if (typeof onShow === 'function') {
          onShow();
        }
      }
    };

  if (this.transitionIn) {
    effect = this.transitionIn;
  }
  else if (!this.minimized && (this.maximized || $(window).width() <= 600)) {
    effect = {translateX: [0, '101%']};
  }
  else {
    effect = quasar.theme === 'ios' ? 'transition.shrinkIn' : 'transition.slideUpIn';
  }

  this.$el.removeClass('hidden');
  this.$content.velocity(effect, options);
  if (!this.maximized) {
    this.$backdrop.addClass('active');
  }
  return this;
};

Modal.prototype.close = function(onClose) {
  var
    effect,
    self = this,
    options = {
      duration: duration,
      complete: function() {
        if (self.selfDestroy) {
          self.destroy();
        }
        self.__onCloseHandlers.forEach(function(handler) {
          handler();
        });
        if (typeof onClose === 'function') {
          onClose();
        }
      }
    };

  if (this.transitionOut) {
    effect = this.transitionOut;
  }
  else if (!this.minimized && (this.maximized || $(window).width() <= 600)) {
    effect = {translateX: ['101%', 0]};
  }
  else {
    effect = quasar.theme === 'ios' ? 'transition.shrinkOut' : 'transition.slideDownOut';
  }

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
