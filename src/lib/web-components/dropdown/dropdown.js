'use strict';

var
  body = $('body'),
  win = $(window),
  offset = 20,
  dropdownTemplate = require('raw!./dropdown.html'),
  contextTemplate = require('raw!./context-dropdown.html')
  ;

function animate(menuElement, position, duration, opening, fixed) {
  var
    windowWidth = win.width(),
    windowHeight = win.height(),
    menu = $(menuElement),
    menuWidth = menu.width(),
    menuHeight = menu.height(),
    transition,
    toRight = position.left + menuWidth < windowWidth || 2 * position.left < windowWidth,
    toBottom = position.top + menuHeight < windowHeight || 2 * position.top < windowHeight,
    css = {
      top: '',
      right: '',
      bottom: '',
      left: '',
      maxHeight: ''
    };


  if (toRight) {
    css.left = position.left + 'px';
  }
  else {
    css.left = Math.max(10, position.left - menuWidth) + 'px';
  }

  if (toBottom) {
    css.top = position.top + 'px';
    if (windowHeight - position.top < menuHeight) {
      css.maxHeight = windowHeight - position.top - offset + 'px';
    }
  }
  else {
    css.top = Math.max(10, position.top - menuHeight) + 'px';
    if (position.top < menuHeight) {
      css.maxHeight = position.top - offset + 'px';
    }
  }


  if (!opening) {
    toBottom = !toBottom;
  }

  menu
    .velocity('stop')
    .css(css)
    .velocity('transition.slide' + (toBottom ? 'Down' : 'Up') + (opening ? 'In' : 'Out'), {
      duration: duration
    });
}

var vm = {
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
    toggle: function(event) {
      this[this.opened ? 'close' : 'open'](event);
    },
    open: function(event) {
      event.preventDefault();

      if (this.opened) {
        return;
      }

      this.opened = true;
      quasar.nextTick(function() {
        body.mousedown(this.close);
      }.bind(this));

      this.position = {
        top: event.clientY,
        left: event.clientX
      };

      animate(this.$els.menu, this.position, this.duration, this.opened);

      return false;
    },
    close: function() {
      if (!this.opened) {
        return;
      }

      this.opened = false;
      body.off('mousedown', this.close);

      animate(this.$els.menu, this.position, this.duration, this.opened);
    }
  }
};

Vue.component('dropdown', {
  mixins: [vm],
  template: dropdownTemplate,
  destroy: function() {
    body.off('mousedown', this.close);
  }
});

Vue.component('context-dropdown', {
  mixins: [vm],
  template: contextTemplate,
  ready: function() {
    this.target = $(this.$el).parent();

    // also include margins for context menu
    if (this.target.hasClass('quasar-page')) {
      this.target = this.target.parent();
    }

    this.target.on('contextmenu', this.open);
  },
  destroy: function() {
    this.target.off('contextmenu', this.open);
    body.off('mousedown', this.close);
  }
});
