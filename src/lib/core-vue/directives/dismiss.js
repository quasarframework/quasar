'use strict';

Vue.directive('dismiss', {
  bind: function() {
    this.container = $(this.el);
    this.container.css('position', 'relative');
    this.target = this.container.find('.dismiss');

    if (this.target.length === 0) {
      this.target = $('<div class="default dismiss"><i>delete</i></div>').appendTo(this.container);
    }
  },
  update: function(fn) {
    if (fn && typeof fn !== 'function') {
      throw new Error('v-dismiss requires a function if parameter is specified. ' + fn);
    }

    this.target.click(function() {
      this.container.slideUp({complete: fn});
    }.bind(this));
  },
  unbind: function() {
    this.target.off('click');
  }
});
