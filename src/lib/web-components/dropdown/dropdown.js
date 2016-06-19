'use strict';

var
  body = $('body'),
  win = $(window),
  template = require('raw!./dropdown.html'),
  offset = 20
  ;

function animate(menuElement, containerElement, duration, opening) {
  var
    windowWidth = win.width(),
    windowHeight = win.height(),
    containerPosition = $(containerElement).offset(),
    menu = $(menuElement),
    menuWidth = menu.width(),
    menuHeight = menu.height(),
    transition;

  var toRight = containerPosition.left + offset + menuWidth < windowWidth;
  var toDown = containerPosition.top + offset + menuHeight < windowHeight;

  var css = {};

  if (toRight) {
    css.left = offset + 'px';
    css.right = '';
  }
  else {
    css.left = '';
    css.right = offset + 'px';
  }

  if (toDown) {
    css.top = offset + 'px';
    css.bottom = '';
  }
  else {
    css.top = '';
    css.bottom = offset + 'px';
  }

  if (!opening) {
    toDown = !toDown;
  }

  menu
    .velocity('stop')
    .css(css)
    .velocity('transition.slide' + (toDown ? 'Down' : 'Up') + (opening ? 'In' : 'Out'), {
      duration: duration
    });
}

Vue.component('dropdown', {
  template: template,
  props: {
    duration: {
      type: Number,
      default: 100
    }
  },
  data: function() {
    return {
      opened: false
    };
  },
  methods: {
    toggle: function() {
      this[this.opened ? 'close' : 'open']();
    },
    open: function() {
      if (this.opened) {
        return;
      }

      this.opened = true;
      quasar.nextTick(function() {
        body.click(this.close);
      }.bind(this));

      animate(this.$els.menu, this.$el, this.duration, this.opened);
    },
    close: function() {
      if (!this.opened) {
        return;
      }

      this.opened = false;
      body.off('click', this.close);

      animate(this.$els.menu, this.$el, this.duration, this.opened);
    }
  },
  destroy: function() {
    body.off('click', this.close);
  }
});
