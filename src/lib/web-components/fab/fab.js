'use strict';

var template = $(require('raw!./fab.html'));

Vue.component('fab', {
  template: template.find('#fab').html(),
  props: {
    type: {
      type: Array,
      default: function() {
        return ['primary'];
      },
      coerce: function(value) {
        return Array.isArray(value) || typeof value === 'undefined' ? value : value.split(' ');
      }
    },
    icon: {
      type: String,
      default: 'add'
    },
    activeIcon: {
      type: String,
      default: 'close'
    },
    direction: {
      type: String,
      default: 'right'
    },
    click: {
      type: Function
    },
    backdrop: {
      type: Boolean,
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
    toggle: function(fromBackdrop) {
      this.opened = !this.opened;

      if (!fromBackdrop && this.click && !this.opened) {
        this.click();
        return;
      }
    }
  },
  events: {
    closeFAB: function() {
      this.toggle(true);
    }
  }
});

Vue.component('small-fab', {
  template: template.find('#small-fab').html(),
  methods: {
    closeFAB: function() {
      this.$dispatch('closeFAB');
    }
  }
});
