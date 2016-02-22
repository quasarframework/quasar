'use strict';

var navigationTemplate = require('raw!./screen-navigation.html');

Vue.component('quasar-navigation', {
  template: navigationTemplate,
  data: function() {
    var
      links,
      pages = quasar.data.manifest.pages
      ;

    links = Object.keys(pages).filter(function(key) {
      return pages[key].navigation;
    });
    links = links.map(function(link) {
      link = pages[link];
      link.navigation.order = link.navigation.order || 100;
      return link;
    });

    links = links.sort(function(link, secondLink) {
      return link.navigation.order - secondLink.navigation.order;
    });

    return {
      page: '',
      group: '',
      links: links
    };
  },
  methods: {
    navigateTo: function(link) {
      var
        name = link.name,
        route = link.navigation.route
        ;

      quasar.navigate.to.route(
        '#/' +
        (name === 'index' && !route ? '' : name) +
        (route ? (name !== 'index' ? '/' : '') + route : '')
      );
    }
  },
  ready: function() {
    var
      nav = $(this.$el),
      scroller = nav.find('> .quasar-navigation-container'),
      leftScroll = nav.find('> .left-scroll'),
      rightScroll = nav.find('> .right-scroll'),
      links = scroller.find('.quasar-navigation-link')
      ;

    this.gc = {
      resizers: []
    };

    function scrollToSelectedIfNeeded(tab) {
      if (!nav.hasClass('scrollable')) {
        return;
      }

      var contentRect = scroller[0].getBoundingClientRect();
      var tabRect = tab[0].getBoundingClientRect();

      var tabWidth = tabRect.width;
      var tabOffsetLeft = tabRect.left - contentRect.left;

      var leftPosition = tabOffsetLeft - scroller.scrollLeft();

      if (leftPosition < 0) {
        scroller[0].scrollLeft += leftPosition;
      }
      else {
        leftPosition += tabWidth - scroller[0].offsetWidth;
        /* istanbul ignore else */
        if (leftPosition > 0) {
          scroller[0].scrollLeft += leftPosition;
        }
      }
    }

    function updateScrollIndicator() {
      nav.addClass('scrollable');
      if (scroller.width() >= scroller[0].scrollWidth) {
        nav.removeClass('scrollable');
      }

      leftScroll.removeClass('invisible');
      rightScroll.removeClass('invisible');
      if (scroller.scrollLeft() <= 0) {
        leftScroll.addClass('invisible');
      }
      if (scroller.scrollLeft() + scroller.innerWidth() + 5 >= scroller[0].scrollWidth) {
        rightScroll.addClass('invisible');
      }
    }

    scroller.scroll(updateScrollIndicator);
    $(window).resize(updateScrollIndicator);
    this.gc.resizers.push([$(window), updateScrollIndicator]);

    leftScroll.click(function() {scroller[0].scrollLeft -= 40;});
    rightScroll.click(function() {scroller[0].scrollLeft += 40;});

    this.gc.updateCurrents = function(context) {
      this.page = context.name;
      var manifest = context.manifest;

      if (manifest.navigation && manifest.navigation.group) {
        this.group = manifest.navigation.group;
      }
      else {
        this.group = '';
      }

      Vue.nextTick(updateScrollIndicator);
      //scrollToSelectedIfNeeded(activeTab);
    }.bind(this);

    quasar.events.on('app:page:ready', this.gc.updateCurrents);

    links
      .click(function() {
        scrollToSelectedIfNeeded($(this));
      })
      .each(/* istanbul ignore next */ function() {
        var hammer = $(this).hammer().getHammer();
        var lastOffset = 0;

        hammer.on('panmove', function(ev) {
          scroller[0].scrollLeft += lastOffset - ev.deltaX;
          lastOffset = ev.deltaX;
        });
        hammer.on('panend', function() {
          lastOffset = 0;
        });
      });
  },
  destroyed: function() {
    quasar.events.off('app:page:ready', this.gc.autoSelectTab);

    this.gc.resizers.forEach(function(resize) {
      resize[0].off('resize', resize[1]);
    });
  }
});


var screenTemplate = require('raw!./screen.html');

Vue.component('screen', {
  template: screenTemplate
});

Vue.component('page', {
  template: '<div class="quasar-pages"></div>'
});
