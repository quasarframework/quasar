'use strict';

Vue.directive('scroll', {
  bind: function() {
    var self = this;

    this.element = $(this.el);
    this.scroll = function() {};

    quasar.events.once('app:page:ready', function(page) {
      self.pageName = page.name;
      self.pageContainer = quasar.current.page.scrollContainer;
      self.pageContainer.scroll(self.scroll);
    });
  },
  update: function(handler) {
    if (typeof handler !== 'function') {
      this.scroll = $.noop;
      console.error('v-scroll requires a function as parameter', this.el);
      return;
    }

    this.scroll = function() {
      handler(this.pageContainer.scrollTop());
    }.bind(this);
  },
  unbind: function() {
    this.pageContainer.off('scroll', this.scroll);
  }
});
