'use strict';

var
  body = $('body'),
  template = $(require('raw!./drawer.html')),
  drawerAnimationSpeed = 150,
  overlayOpacity = .7
  ;

/* istanbul ignore next */
function getCurrentPosition(node) {
  var transform = node.css('transform');

  return transform !== 'none' ? parseInt(transform.split(/[()]/)[1].split(', ')[4], 10) : 0;
}

/* istanbul ignore next */
function matToggleAnimate(onRightSide, opening, node, overlay, percentage, drawerWidth, done) {
  var
    currentPosition = getCurrentPosition(node),
    closePosition = (onRightSide ? 1 : -1) * drawerWidth
    ;

  node.velocity('stop').velocity(
    {translateX: opening ? [0, currentPosition] : [closePosition, currentPosition]},
    {duration: !opening || currentPosition !== 0 ? drawerAnimationSpeed : 0}
  );

  if (opening) {
    overlay.addClass('active');
  }

  overlay
  .css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')')
  .velocity('stop')
  .velocity(
    {
      'backgroundColor': '#000',
      'backgroundColorAlpha': opening ? overlayOpacity : .01
    },
    {
      duration: drawerAnimationSpeed,
      complete: function() {
        if (!opening) {
          overlay.removeClass('active');
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
function iosToggleAnimate(onRightSide, opening, overlay, drawerWidth, done) {
  if (opening) {
    overlay.addClass('active');
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
          overlay.removeClass('active');
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
    overlay = el.find('> .drawer-overlay')
    ;

  if (event.isFinal) {
    this.opened = position > this.width / 1.7;
  }

  if (quasar.runs.on.ios) {
    position = Math.min(position, this.width);

    if (event.isFinal) {
      iosToggleAnimate(this.rightSide, this.opened, overlay, this.width);
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
      matToggleAnimate(this.rightSide, this.opened, content, overlay, percentage, this.width);
      return;
    }
    content.css({
      'transform': 'translateX(' + position + 'px)'
    });
    overlay
      .addClass('active')
      .css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')');
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
    overlay = el.find('> .drawer-overlay')
    ;

  if (event.isFinal) {
    this.opened = Math.abs(position) <= 75;
  }

  if (quasar.runs.on.ios) {
    position = initialPosition + position;

    if (event.isFinal) {
      iosToggleAnimate(this.rightSide, this.opened, overlay, this.width);
      return;
    }
    body.css({
      'transform': 'translateX(' + position + 'px)'
    });
  }
  else { // mat
    var percentage = 1 + (this.rightSide ? -1 : 1) * position / this.width;

    if (event.isFinal) {
      matToggleAnimate(this.rightSide, this.opened, content, overlay, percentage, this.width);
      return;
    }
    content.css({
      'transform': 'translateX(' + position + 'px)',
    });
    overlay.css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')');
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
      var overlay = $(this.$el).find('> .drawer-overlay');

      if (quasar.runs.on.ios) {
        iosToggleAnimate(
          this.rightSide,
          this.opened,
          overlay,
          this.width,
          done
        );
      }
      else {
        matToggleAnimate(
          this.rightSide,
          this.opened,
          $(this.$el).find('> .drawer-content'),
          overlay,
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
  props: ['page', 'route', 'click', 'icon', 'label'],
  data: function() {
    return {
      active: false
    };
  },
  methods: {
    execute: function() {
      quasar.close.drawers(function() {
        if (this.click) {
          this.click();
          return;
        }

        if (this.route) {
          quasar.navigate.to.route(this.route);
          return;
        }

        if (this.page) {
          quasar.navigate.to.route('#/' + (this.page === 'index' ? '' : this.page));
        }
      }.bind(this));
    }
  },
  compiled: function() {
    if (!this.page) {
      return;
    }

    var page = quasar.data.manifest.pages[this.page];

    if (!page) {
      throw new Error('Drawer link points to unavailable page "' + this.page + '"');
    }

    this.icon = page.icon;
    this.label = page.label;

    this.gc = {
      onPageChange: function(context) {
        this.active = context.name === page.name;
      }.bind(this)
    };

    quasar.events.on('app:page:ready', this.gc.onPageChange);
  },
  destroyed: function() {
    if (this.page) {
      quasar.events.off('app:page:ready', this.gc.onPageChange);
    }
  }
});
