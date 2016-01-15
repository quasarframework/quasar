'use strict';

var
  body = $('body'),
  template = $(require('raw!./drawer.html')),
  drawerAnimationSpeed = 150
  ;

function closeDrawer() {
  quasar.drawer.close();
}

_.forEach(['cover', 'header'], function(type) {
  Vue.component('quasar-drawer-' + type, {
    template: template.find('#quasar-drawer-' + type).html()
  });
});

Vue.component('quasar-drawer-divider', {
  template: '<div class="quasar-drawer-divider"></div>'
});

Vue.component('quasar-drawer-item', {
  template: template.find('#quasar-drawer-item').html(),
  props: ['route'],
  ready: function() {
    var
      el = $(this.$el),
      route = this.route
      ;

    el.click(function() {
      closeDrawer();

      if (route && route !== quasar.get.current.route()) {
        quasar.navigate.to.route(route);
      }
    });
  }
});


/* istanbul ignore next */
function animate(open, node, currentPosition, width) {
  node.velocity(
    {translateX: open ? [0, currentPosition] : [-width, currentPosition]},
    {duration: drawerAnimationSpeed}
  );

  if (open) {
    body.addClass('inactive');
    node.css({'outline': '9999px solid rgba(0,0,0,.5)'});
  }
  else {
    body.removeClass('inactive');
    node.css({outline: ''});
  }
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
        position = Math.min(0, event.center.x - this.width),
        percentage = (this.width - Math.abs(position)) / this.width
        ;

      if (event.isFinal) {
        this.opened = event.center.x > 75;
        animate(this.opened, content, position, this.width);
        return;
      }

      body.addClass('inactive');
      content.css({
        'transform': 'translateX(' + position + 'px)',
        'outline': '9999px solid rgba(0,0,0,' + percentage * .5 + ')'
      });
    },
    closeByTouch: /* istanbul ignore next */ function(event) {
      if ($(window).width > 767) {
        return;
      }

      var
        content = $(this.$el).find('> .quasar-drawer-content'),
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
        animate(this.opened, content, position, this.width);
        return;
      }

      content.css({
        'transform': 'translateX(' + position + 'px)',
        'outline': '9999px solid rgba(0,0,0,' + percentage * .5 + ')'
      });
    },
    toggle: /* istanbul ignore next */ function(state) {
      if (_.isBoolean(state) && this.opened === state) {
        return;
      }

      this.opened = !this.opened;
      animate(
        this.opened,
        $(this.$el).find('> .quasar-drawer-content'),
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
    var el = $(this.$el);

    this.width = parseInt(el.find('> .quasar-drawer-content').css('width'), 10);

    /* istanbul ignore next */
    el.parents('.quasar-layout').find('.quasar-drawer-toggle').click(function() {
      this.toggle();
    }.bind(this));

    body.addClass('with-drawer');
    quasar.drawer = this;

    $(window).resize(this.close);
  },
  destroyed: function() {
    body.removeClass('with-drawer inactive');
    delete quasar.drawer;
    $(window).off('resize', this.close);
  }
});
