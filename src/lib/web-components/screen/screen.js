'use strict';

var
  screenTemplate = require('raw!./screen.html'),
  navigationTemplate = require('raw!./screen-tabs.html'),
  scrollNavigationSpeed = 5 // in pixels
  ;

Vue.component('screen', {
  template: screenTemplate
});

Vue.component('page', {
  template: '<div class="quasar-pages"></div>'
});

Vue.component('screen-tabs', {
  template: navigationTemplate,
  data: function() {
    var
      tabs,
      pages = quasar.data.manifest.pages
      ;

    tabs = Object.keys(pages).filter(function(key) {
      return pages[key].navigation && pages[key].layout === quasar.layout.name;
    });
    tabs = tabs.map(function(tab) {
      tab = pages[tab];
      tab.navigation.order = tab.navigation.order || 100;
      return tab;
    });

    tabs = tabs.sort(function(tab, secondTab) {
      return tab.navigation.order - secondTab.navigation.order;
    });

    return {
      page: '',
      group: '',
      tabs: tabs
    };
  },
  methods: {
    navigateTo: function(tab) {
      var
        name = tab.name,
        route = tab.navigation.route
        ;

      quasar.navigate.to.route(
        '#/' +
        (name === 'index' && !route ? '' : name) +
        (route ? (name !== 'index' ? '/' : '') + route : '')
      );
    },
    update: function(context) {
      var tabController = this.$refs.tabController;

      this.page = context.name;
      var manifest = context.manifest;

      if (manifest.navigation && manifest.navigation.group) {
        this.group = manifest.navigation.group;
      }
      else {
        this.group = '';
      }

      setTimeout(function() {
        tabController.updateScrollIndicator();
      }, 50);
    }
  },
  ready: function() {
    quasar.events.on('app:page:ready', this.update);
  },
  destroyed: function() {
    quasar.events.off('app:page:ready', this.update);
  }
});
