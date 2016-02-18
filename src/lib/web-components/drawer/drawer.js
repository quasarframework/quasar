'use strict';

var
  template = $(require('raw!./drawer.html')),
  drawerAnimationSpeed = 200,
  overlayOpacity = .7,
  widthBreakpoint = 600 /* equivalent to CSS $layout-medium-min */
  ;

['header', 'title'].forEach(function(type) {
  Vue.component('quasar-drawer-' + type, {
    template: template.find('#quasar-drawer-' + type).html()
  });
});

Vue.elementDirective('quasar-drawer-divider', {
  template: '<div class="quasar-drawer-divider"></div>'
});

Vue.component('quasar-drawer-footer', {
  template: '<div class="quasar-drawer-footer"><slot></slot></div>'
});

Vue.component('quasar-drawer-link', {
  template: template.find('#quasar-drawer-link').html(),
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


/* istanbul ignore next */
function toggleAnimate(open, node, overlay, percentage, currentPosition, width, done) {
  node.velocity(
    {translateX: open ? [0, currentPosition] : [-width, currentPosition]},
    {duration: drawerAnimationSpeed}
  );

  if (open) {
    overlay.addClass('active');
  }

  overlay
  .css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')')
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

Vue.component('quasar-drawer', {
  template: template.find('#quasar-drawer').html(),
  data: function() {
    return {
      opened: false
    };
  },
  methods: {
    openByTouch: /* istanbul ignore next */ function(event) {
      if ($(window).width() >= widthBreakpoint) {
        return;
      }

      var
        content = $(this.$el).find('> .quasar-drawer-content'),
        overlay = $(this.$el).find('> .quasar-drawer-overlay'),
        position = Math.min(0, event.center.x - this.width),
        percentage = (this.width - Math.abs(position)) / this.width
        ;

      if (event.isFinal) {
        this.opened = event.center.x > 75;
        toggleAnimate(this.opened, content, overlay, percentage, position, this.width);
        return;
      }

      content.css({
        'transform': 'translateX(' + position + 'px)',
      });
      overlay.addClass('active')
        .css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')');
    },
    closeByTouch: /* istanbul ignore next */ function(event) {
      if ($(window).width() >= widthBreakpoint) {
        return;
      }

      var
        content = $(this.$el).find('> .quasar-drawer-content'),
        overlay = $(this.$el).find('> .quasar-drawer-overlay'),
        position = event.deltaX,
        percentage = position < 0 ? 1 + position / this.width : 1
        ;

      if (position > 0) {
        position = 0;
      }
      else if (position < - this.width) {
        position = - this.width;
      }

      if (event.isFinal) {
        this.opened = Math.abs(position) <= 75;
        toggleAnimate(this.opened, content, overlay, percentage, position, this.width);
        return;
      }

      content.css({
        'transform': 'translateX(' + position + 'px)',
      });
      overlay.css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')');
    },
    toggle: /* istanbul ignore next */ function(state, done) {
      if (typeof state === 'boolean' && this.opened === state) {
        if (typeof done === 'function') {
          done();
        }
        return;
      }

      this.opened = !this.opened;
      toggleAnimate(
        this.opened,
        $(this.$el).find('> .quasar-drawer-content'),
        $(this.$el).find('> .quasar-drawer-overlay'),
        this.opened ? .01 : 1,
        (this.opened ? -1 : 0) * this.width,
        this.width,
        done
      );
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
      content = el.find('> .quasar-drawer-content')
      ;

    this.width = parseInt(content.css('width'), 10) + /* scrollbar */ 15;

     /* istanbul ignore next */
    el.parents('.quasar-layout').find('.quasar-drawer-toggle').click(function() {
      this.toggle();
    }.bind(this));

    quasar.drawer = this;
  },
  destroy: function() {
    delete quasar.drawer;
  }
});
