'use strict';

var
  body = $('body'),
  template = $(require('raw!./drawer.html')),
  drawerAnimationSpeed = 150,
  backdropOpacity = .7
  ;

/* istanbul ignore next */
function getCurrentPosition(node) {
  var transform = node.css('transform');

  return transform !== 'none' ? parseInt(transform.split(/[()]/)[1].split(', ')[4], 10) : 0;
}

/* istanbul ignore next */
function matToggleAnimate(onRightSide, opening, node, backdrop, percentage, drawerWidth, done) {
  var
    currentPosition = getCurrentPosition(node),
    closePosition = (onRightSide ? 1 : -1) * drawerWidth
    ;

  node.velocity('stop').velocity(
    {translateX: opening ? [0, currentPosition] : [closePosition, currentPosition]},
    {duration: !opening || currentPosition !== 0 ? drawerAnimationSpeed : 0}
  );

  if (opening) {
    backdrop.addClass('active');
  }

  backdrop
  .css('background-color', 'rgba(0,0,0,' + percentage * backdropOpacity + ')')
  .velocity('stop')
  .velocity(
    {
      'backgroundColor': '#000',
      'backgroundColorAlpha': opening ? backdropOpacity : .01
    },
    {
      duration: drawerAnimationSpeed,
      complete: function() {
        if (!opening) {
          backdrop.removeClass('active');
          $(window).off('resize', quasar.close.drawers);
        }
        else {
          $(window).resize(quasar.close.drawers);
        }
        if (typeof done === 'function') {
          done();
        }
      }
    }
  );
}

/* istanbul ignore next */
function iosToggleAnimate(onRightSide, opening, backdrop, drawerWidth, done) {
  if (opening) {
    backdrop.addClass('active');
  }

  var
    currentPosition = getCurrentPosition(body),
    openPosition = (onRightSide ? -1 : 1) * drawerWidth
    ;

  body.velocity('stop').velocity(
    {translateX: opening ? [openPosition, currentPosition] : [0, currentPosition]},
    {
      duration: !opening || currentPosition !== openPosition ? drawerAnimationSpeed : 0,
      complete: function() {
        if (!opening) {
          backdrop.removeClass('active');
          $(window).off('resize', quasar.close.drawers);
        }
        else {
          $(window).resize(quasar.close.drawers);
        }
        if (typeof done === 'function') {
          done();
        }
      }
    }
  );
}

/* istanbul ignore next */
function openByTouch(event) {
  var
    el = $(this.$el),
    content = el.find('> .drawer-content');

  if (content.css('position') !== 'fixed') {
    return;
  }

  var
    position = Math.abs(event.deltaX),
    backdrop = el.find('> .drawer-backdrop')
    ;

  if (event.isFinal) {
    this.opened = position > 75;
  }

  if (quasar.theme === 'ios') {
    position = Math.min(position, this.width);

    if (event.isFinal) {
      iosToggleAnimate(this.rightSide, this.opened, backdrop, this.width);
      return;
    }
    body.css({
      'transform': 'translateX(' + (this.rightSide ? -1 : 1) * position + 'px)'
    });
  }
  else { // mat
    if (this.rightSide) {
      position = Math.max(this.width - position, 0);
    }
    else {
      position = Math.min(0, position - this.width);
    }

    var percentage = (this.width - Math.abs(position)) / this.width;

    if (event.isFinal) {
      matToggleAnimate(this.rightSide, this.opened, content, backdrop, percentage, this.width);
      return;
    }
    content.css({
      'transform': 'translateX(' + position + 'px)'
    });
    backdrop
      .addClass('active')
      .css('background-color', 'rgba(0,0,0,' + percentage * backdropOpacity + ')');
  }
}

/* istanbul ignore next */
function getBetween(value, min, max) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

/* istanbul ignore next */
function closeByTouch(event) {
  var
    el = $(this.$el),
    content = el.find('> .drawer-content');

  if (content.css('position') !== 'fixed') {
    return;
  }

  var
    position = this.rightSide ? getBetween(event.deltaX, 0, this.width) : getBetween(event.deltaX, -this.width, 0),
    initialPosition = (this.rightSide ? - 1 : 1) * this.width,
    backdrop = el.find('> .drawer-backdrop')
    ;

  if (event.isFinal) {
    this.opened = Math.abs(position) <= 75;
  }

  if (quasar.theme === 'ios') {
    position = initialPosition + position;

    if (event.isFinal) {
      iosToggleAnimate(this.rightSide, this.opened, backdrop, this.width);
      return;
    }
    body.css({
      'transform': 'translateX(' + position + 'px)'
    });
  }
  else { // mat
    var percentage = 1 + (this.rightSide ? -1 : 1) * position / this.width;

    if (event.isFinal) {
      matToggleAnimate(this.rightSide, this.opened, content, backdrop, percentage, this.width);
      return;
    }
    content.css({
      'transform': 'translateX(' + position + 'px)',
    });
    backdrop.css('background-color', 'rgba(0,0,0,' + percentage * backdropOpacity + ')');
  }
}

Vue.component('drawer', {
  template: template.find('#drawer').html(),
  props: {
    'right-side': {
      type: Boolean,
      default: false,
      coerce: function(value) {
        return value ? true : false;
      }
    },
    'swipe-only': {
      type: Boolean,
      default: false,
      coerce: function(value) {
        return value ? true : false;
      }
    }
  },
  data: function() {
    return {
      opened: false
    };
  },
  methods: {
    openByTouch: function(event) {
      openByTouch.call(this, event);
    },
    closeByTouch: function(event) {
      closeByTouch.call(this, event);
    },
    toggle: /* istanbul ignore next */ function(state, done) {
      if (typeof state === 'boolean' && this.opened === state) {
        if (typeof done === 'function') {
          done();
        }
        return;
      }

      this.opened = !this.opened;
      var backdrop = $(this.$el).find('> .drawer-backdrop');

      if (quasar.theme === 'ios') {
        iosToggleAnimate(
          this.rightSide,
          this.opened,
          backdrop,
          this.width,
          done
        );
      }
      else {
        matToggleAnimate(
          this.rightSide,
          this.opened,
          $(this.$el).find('> .drawer-content'),
          backdrop,
          this.opened ? .01 : 1,
          this.width,
          done
        );
      }
    },
    open: /* istanbul ignore next */ function(done) {
      this.toggle(true, done);
    },
    close: /* istanbul ignore next */ function(done) {
      this.toggle(false, done);
    }
  },
  ready: /* istanbul ignore next */ function() {
    var
      el = $(this.$el),
      content = el.find('> .drawer-content'),
      toggles = el.parents('.screen').find('.' + (this.rightSide ? 'right' : 'left') + '-drawer-toggle')
      ;

    this.width = parseInt(content.css('width'), 10);

    toggles.click(function() {
      this.toggle();
    }.bind(this));

    if (this.swipeOnly) {
      el.addClass('swipe-only');
      toggles.addClass('always-visible');
    }

    quasar[(this.rightSide ? 'right' : 'left') + 'Drawer'] = this;
  },
  destroy: function() {
    delete quasar[(this.rightSide ? 'right' : 'left') + 'Drawer'];
  }
});

$.extend(true, quasar, {
  close: {
    drawers: function(fn) {
      if (quasar.leftDrawer && quasar.leftDrawer.opened) {
        quasar.leftDrawer.close(fn);
        return;
      }
      if (quasar.rightDrawer && quasar.rightDrawer.opened) {
        quasar.rightDrawer.close(fn);
        return;
      }

      if (typeof fn === 'function') {
        fn();
      }
    }
  }
});

Vue.component('drawer-link', {
  template: template.find('#drawer-link').html(),
  props: ['page', 'route'],
  methods: {
    launch: function(handler) {
      quasar.close.drawers(function() {
        handler(this.route || this.page);
      }.bind(this));
    }
  },
  beforeCompile: function() {
    if (!this.page) {
      console.error('Drawer link missing page attribute');
      return;
    }

    var page = quasar.data.manifest.pages[this.page];

    if (!page) {
      console.error('Drawer link points to unavailable page "' + this.page + '"');
    }

    this.icon = page.icon;
    this.label = page.label;
  }
});
