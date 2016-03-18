'use strict';

function goToPage(page) {
  if (page.startsWith('#/')) {
    quasar.navigate.to.route(page);
    return;
  }

  quasar.navigate.to.route('#/' + (page === 'index' ? '' : page));
}

Vue.directive('page-link', {
  update: function(page) {
    this.handler = function() {
      if (typeof page === 'function') {
        page(goToPage);
      }
      else if (typeof page === 'string') {
        goToPage(page);
      }
      else {
        throw new Error('v-page-link: parameter is not string or fn; use .literal?');
      }
    };

    $(this.el).click(this.handler);
  },
  unbind: function() {
    $(this.el).off('click', this.handler);
  }
});

Vue.directive('active-page', {
  update: function(page) {
    var el = $(this.el);

    this.handler = function(context) {
      el[context.name === page ? 'addClass' : 'removeClass']('active');
    };

    quasar.events.on('app:page:ready', this.handler);
  },
  unbind: function() {
    quasar.events.off('app:page:ready', this.handler);
  }
});
