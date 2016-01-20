'use strict';

var
  body = $('body'),
  template = $(require('raw!./drawer.html')),
  drawerAnimationSpeed = 200,
  overlayOpacity = .7
  ;

/* istanbul ignore next */
function closeDrawer() {
  quasar.drawer.close();
}

_.forEach(['header', 'title'], function(type) {
  Vue.component('quasar-drawer-' + type, {
    template: template.find('#quasar-drawer-' + type).html()
  });
});

Vue.component('quasar-drawer-divider', {
  template: '<div class="quasar-drawer-divider"></div>'
});

Vue.component('quasar-drawer-footer', {
  template: '<div class="quasar-drawer-footer"><slot></slot></div>'
});

Vue.component('quasar-drawer-item', {
  template: template.find('#quasar-drawer-item').html(),
  props: ['route'],
  ready: function() {
    var
      el = $(this.$el),
      route = this.route
      ;

    el.click(/* istanbul ignore next */ function() {
      closeDrawer();

      if (route && route !== quasar.get.current.route()) {
        quasar.navigate.to.route(route);
      }
    });
  }
});


/* istanbul ignore next */
function animate(open, node, overlay, percentage, currentPosition, width) {
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
        }
      }
    }
  );

  body[open ? 'addClass' : 'removeClass']('inactive');
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
      if ($(window).width > 767) {
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
        animate(this.opened, content, overlay, percentage, position, this.width);
        return;
      }

      content.css({
        'transform': 'translateX(' + position + 'px)',
      });
      overlay.addClass('active')
        .css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')');
    },
    closeByTouch: /* istanbul ignore next */ function(event) {
      if ($(window).width > 767) {
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
        animate(this.opened, content, overlay, percentage, position, this.width);
        return;
      }

      content.css({
        'transform': 'translateX(' + position + 'px)',
      });
      overlay.css('background-color', 'rgba(0,0,0,' + percentage * overlayOpacity + ')');
    },
    toggle: /* istanbul ignore next */ function(state) {
      if (_.isBoolean(state) && this.opened === state) {
        return;
      }

      this.opened = !this.opened;
      animate(
        this.opened,
        $(this.$el).find('> .quasar-drawer-content'),
        $(this.$el).find('> .quasar-drawer-overlay'),
        this.opened ? .01 : 1,
        (this.opened ? -1 : 0) * this.width,
        this.width
      );
    },
    open: /* istanbul ignore next */ function() {
      this.toggle(true);
    },
    close: /* istanbul ignore next */ function() {
      this.toggle(false);
    }
  },
  ready: function() {
    var
      el = $(this.$el),
      content = el.find('> .quasar-drawer-content')
      ;

    this.width = parseInt(content.css('width'), 10);

    /* istanbul ignore next */
    el.parents('.quasar-layout').find('.quasar-drawer-toggle').click(function() {
      this.toggle();
    }.bind(this));

    body.addClass('with-drawer');
    quasar.drawer = this;

    content.find('> .quasar-drawer-container')
      .css('padding-bottom', content.find('.quasar-drawer-footer').height() + 16 + 'px');

    $(window).resize(this.close);
  },
  destroyed: function() {
    body.removeClass('with-drawer inactive');
    delete quasar.drawer;
    $(window).off('resize', this.close);
  }
});
