'use strict';

Vue.directive('card-minimize', {
  bind: function() {
    this.button = $(this.el);
    this.target = this.button.parents('.card').children().filter(':not(.card-title)');
  },
  update: function(fn) {
    if (fn && typeof fn !== 'function') {
      throw new Error('v-card-minimize requires a function if parameter is specified. ' + fn);
    }

    this.button.click(function() {
      this.target.slideToggle({complete: fn});
    }.bind(this));
  },
  unbind: function() {
    this.button.off('click');
  }
});

Vue.directive('card-close', {
  bind: function() {
    this.button = $(this.el);
    this.card = $(this.button.parents('.card').get(0));
  },
  update: function(fn) {
    if (fn && typeof fn !== 'function') {
      throw new Error('v-card-close requires a function if parameter is specified. ' + fn);
    }

    this.button.click(function() {
      this.card.slideUp({complete: fn});
    }.bind(this));
  },
  unbind: function() {
    this.button.off('click');
  }
});
