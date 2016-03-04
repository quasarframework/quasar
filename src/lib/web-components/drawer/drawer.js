'use strict';

var
  body = $('body'),
  template = $(require('raw!./drawer.html')),
  drawerAnimationSpeed = 200,
  overlayOpacity = .7,
  widthBreakpoint = 919 /* equivalent to CSS $layout-medium-min */,
  drawerWidth = 250
  ;

/* istanbul ignore next */
function getCurrentPosition(node) {
  var transform = node.css('transform');

  return transform !== 'none' ? parseInt(transform.split(/[()]/)[1].split(', ')[4], 10) : 0;
}

/* istanbul ignore next */
function matToggleAnimate(open, node, overlay, percentage, done) {
  var currentPosition = getCurrentPosition(node);

  node.velocity('stop').velocity(
    {translateX: open ? [0, currentPosition] : [-drawerWidth, currentPosition]},
    {duration: !open || currentPosition !== 0 ? drawerAnimationSpeed : 0}
  );

  if (open) {
    overlay.addClass('active');
  }

  overlay
  .css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')')
  .velocity('stop')
  .velocity(
    {
      'backgroundColor': '#000',
      'backgroundColorAlpha': open ? overlayOpacity : .01
    },
    {
      duration: drawerAnimationSpeed,
      complete: function() {
        if (!open) {
          overlay.removeClass('active');
          $(window).off('resize', quasar.drawer.close);
        }
        else {
          $(window).resize(quasar.drawer.close);
        }
        if (typeof done === 'function') {
          done();
        }
      }
    }
  );
}

/* istanbul ignore next */
function iosToggleAnimate(open, overlay, done) {
  if (open) {
    overlay.addClass('active');
  }

  var currentPosition = getCurrentPosition(body);

  body.velocity('stop').velocity(
    {translateX: open ? [drawerWidth, currentPosition] : [0, currentPosition]},
    {
      duration: !open || currentPosition !== drawerWidth ? drawerAnimationSpeed : 0,
      complete: function() {
        if (!open) {
          overlay.removeClass('active');
          $(window).off('resize', quasar.drawer.close);
        }
        else {
          $(window).resize(quasar.drawer.close);
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
  if ($(window).width() >= widthBreakpoint) {
    return;
  }

  var
    position = event.center.x,
    overlay = $(this.$el).find('> .drawer-overlay')
    ;

  if (event.isFinal) {
    this.opened = event.center.x > 75;
  }

  if (quasar.runs.on.ios) {
    position = Math.min(event.center.x, drawerWidth);

    if (event.isFinal) {
      iosToggleAnimate(this.opened, overlay);
      return;
    }
    body.css({
      'transform': 'translateX(' + position + 'px)'
    });
  }
  else { // mat
    position = Math.min(0, position - drawerWidth);
    var
      content = $(this.$el).find('> .drawer-content'),
      percentage = (drawerWidth - Math.abs(position)) / drawerWidth
      ;

    if (event.isFinal) {
      matToggleAnimate(this.opened, content, overlay, percentage);
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
function closeByTouch(event) {
  if ($(window).width() >= widthBreakpoint) {
    return;
  }

  var
    position = event.deltaX,
    overlay = $(this.$el).find('> .drawer-overlay')
    ;

  if (position > 0) {
    position = 0;
  }
  else if (position < - drawerWidth) {
    position = - drawerWidth;
  }

  if (event.isFinal) {
    this.opened = Math.abs(position) <= 75;
  }

  if (quasar.runs.on.ios) {
    position = drawerWidth + position;

    if (event.isFinal) {
      iosToggleAnimate(this.opened, overlay);
      return;
    }
    body.css({
      'transform': 'translateX(' + position + 'px)'
    });
  }
  else { // mat
    var
      content = $(this.$el).find('> .drawer-content'),
      percentage = position < 0 ? 1 + position / drawerWidth : 1
      ;

    if (event.isFinal) {
      matToggleAnimate(this.opened, content, overlay, percentage);
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
          this.opened,
          overlay,
          done
        );
      }
      else {
        matToggleAnimate(
          this.opened,
          $(this.$el).find('> .drawer-content'),
          overlay,
          this.opened ? .01 : 1,
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
  ready: function() {
    var
      el = $(this.$el),
      content = el.find('> .drawer-content')
      ;

   /* istanbul ignore next */
    el.parents('.quasar-screen').find('.drawer-toggle').click(function() {
      this.toggle();
    }.bind(this));

    quasar.drawer = this;
  },
  destroy: function() {
    delete quasar.drawer;
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
      quasar.drawer.close(function() {
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
