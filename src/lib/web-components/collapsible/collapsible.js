'use strict';

Vue.directive('collapsible', {
  bind: function() {
    var self = this;

    $(this.el).addClass('collapsible')
    .children().each(function() {
      $(this).find('div:first-child').click(function() {
        var items = $(this).parent().toggleClass('active');

        if (self.oneAtATime) {
          items.siblings().removeClass('active');
        }
      });
    });
  },
  update: function(freely) {
    this.oneAtATime = !freely;
  },
  unbind: function() {
    $(this.el).find('li').each(function() {
      $(this).find('div:first-child').off('click');
    });
  }
});


Vue.component('quasar-collapsible', {
  template: '<ul class="collapsible"><slot></slot></ul>',
  props: {
    freely: {
      type: Boolean,
      default: false
    }
  },
  ready: function() {
    var self = this;

    this.$on('closeOtherItems', function(child) {
      if (self.freely) {
        return;
      }

      self.$children.forEach(function(item) {
        if (child !== item) {
          item.opened = false;
        }
      });
    });
  }
});

Vue.component('quasar-collapsible-item', {
  template: '<li :class="{active: opened}" @click="toggle()"><slot></slot></li>',
  data: function() {
    return {
      opened: false
    };
  },
  methods: {
    toggle: function() {
      this.opened = !this.opened;

      if (this.opened) {
        this.$dispatch('closeOtherItems', this);
      }
    }
  }
});
