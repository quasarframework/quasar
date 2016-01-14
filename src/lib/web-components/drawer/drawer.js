'use strict';

var
  width = 300,
  template = $(require('raw!./drawer.html'))
  ;

_.forEach(['cover', 'item', 'header'], function(type) {
  Vue.component('quasar-drawer-' + type, {
    template: template.find('#quasar-drawer-' + type).html()
  });
});

Vue.component('quasar-drawer-divider', {
  template: '<div class="quasar-drawer-divider"></div>'
});

/* istanbul ignore next */
function animate(open, node, currentPosition) {
  node.velocity(
    {translateX: open ? [0, currentPosition] : [-width, currentPosition]},
    {duration: 150}
  );

  if (open) {
    $('body').addClass('inactive');
    node.css({'outline': '9999px solid rgba(0,0,0,.5)'});
  }
  else {
    $('body').removeClass('inactive');
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
    open: /* istanbul ignore next */ function(event) {
      var
        content = $(this.$el).find('> .quasar-drawer-content'),
        position = Math.min(0, event.center.x - width),
        percentage = (width - Math.abs(position)) / width
        ;

      if (event.isFinal) {
        this.opened = event.center.x > 75;
        animate(this.opened, content, position);
        return;
      }

      $('body').addClass('inactive');
      content.css({
        'transform': 'translateX(' + position + 'px)',
        'outline': '9999px solid rgba(0,0,0,' + percentage * .5 + ')'
      });
    },
    close: /* istanbul ignore next */ function(event) {
      var
        content = $(this.$el).find('> .quasar-drawer-content'),
        position = event.deltaX,
        percentage = position < 0 ? 1 + position / width : 1
        ;

      if (position > 0) {
        position = 0;
      }
      else if (position < -width) {
        position = - width;
      }

      if (event.isFinal) {
        this.opened = Math.abs(position) <= 75;
        animate(this.opened, content, position);
        return;
      }

      content.css({
        'transform': 'translateX(' + position + 'px)',
        'outline': '9999px solid rgba(0,0,0,' + percentage * .5 + ')'
      });
    },
    toggle: /* istanbul ignore next */ function() {
      this.opened = !this.opened;
      animate(this.opened, $(this.$el).find('> .quasar-drawer-content'));
    }
  },
  ready: function() {
    /* istanbul ignore next */
    $(this.$el).parents('.quasar-layout').find('.quasar-drawer-toggle').click(function() {
      this.toggle();
    }.bind(this));

    $('body').addClass('with-drawer');
  }
});
