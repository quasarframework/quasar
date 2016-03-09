'use strict';

var
  screenTemplate = require('raw!./screen.html'),
  navigationTemplate = require('raw!./screen-navigation.html'),
  scrollNavigationSpeed = 5 // in pixels
  ;

Vue.component('screen', {
  template: screenTemplate
});

Vue.component('page', {
  template: '<div class="quasar-pages"></div>'
});

Vue.component('screen-navigation', {
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
      scroller = nav.find('.screen-navigation-scroller'),
      leftScroll = nav.find('.left-scroll'),
      rightScroll = nav.find('.right-scroll'),
      links = scroller.find('.screen-navigation-link'),
      self = this
      ;

    this.gc = {
      scrollTimer: null,
      resizers: []
    };

    function scrollToSelectedIfNeeded(tab) {
      if (tab.length === 0 || !nav.hasClass('scrollable')) {
        return;
      }

      var contentRect = scroller[0].getBoundingClientRect();
      var tabRect = tab[0].getBoundingClientRect();

      var tabWidth = tabRect.width;
      var offset = tabRect.left - contentRect.left;

      if (offset < 0) {
        animScrollTo(scroller[0].scrollLeft + offset);
      }
      else {
        offset += tabWidth - scroller[0].offsetWidth;
        /* istanbul ignore else */
        if (offset > 0) {
          animScrollTo(scroller[0].scrollLeft + offset);
        }
      }
    }

    function updateScrollIndicator() {
      nav.addClass('scrollable');
      if (scroller.width() >= scroller[0].scrollWidth) {
        nav.removeClass('scrollable');
      }

      leftScroll.removeClass('disabled');
      rightScroll.removeClass('disabled');
      if (scroller.scrollLeft() <= 0) {
        leftScroll.addClass('disabled');
      }
      if (scroller.scrollLeft() + scroller.innerWidth() + 5 >= scroller[0].scrollWidth) {
        rightScroll.addClass('disabled');
      }
    }

    function animScrollTo(value) {
      if (self.gc.scrollTimer) {
        clearInterval(self.gc.scrollTimer);
      }

      scrollTowards(value);
      self.gc.scrollTimer = setInterval(function() {
        if (scrollTowards(value)) {
          clearInterval(self.gc.scrollTimer);
        }
      }, 5);
    }

    function scrollTowards(value) {
      var
        scroll = scroller[0].scrollLeft,
        direction = value < scroll ? -1 : 1,
        done = false
        ;

      scroll += direction * scrollNavigationSpeed;

      if (scroll < 0) {
        done = true;
        scroll = 0;
      }
      else if (direction === -1 && scroll <= value || direction === 1 && scroll >= value) {
        done = true;
        scroll = value;
      }

      scroller[0].scrollLeft = scroll;
      return done;
    }

    scroller.scroll(updateScrollIndicator);
    $(window).resize(updateScrollIndicator);
    this.gc.resizers.push(updateScrollIndicator);

    this.gc.updateCurrents = function(context) {
      this.page = context.name;
      var manifest = context.manifest;

      if (manifest.navigation && manifest.navigation.group) {
        this.group = manifest.navigation.group;
      }
      else {
        this.group = '';
      }

      Vue.nextTick(function() {
        setTimeout(function() {
          updateScrollIndicator();
          scrollToSelectedIfNeeded(links.filter('.active'));
        }, 50);
      });
    }.bind(this);

    quasar.events.on('app:page:ready', this.gc.updateCurrents);

    var scrollEvents = {
      start: [],
      stop: []
    };

    if (quasar.runs.on.desktop) {
      scrollEvents.start.push('mousedown');
      scrollEvents.stop.push('mouseup');
    }
    if (quasar.runs.with.touch) {
      scrollEvents.start.push('touchstart');
      scrollEvents.stop.push('touchend');
    }
    leftScroll.bind(scrollEvents.start.join(' '), function() {
      animScrollTo(0);
    });
    leftScroll.bind(scrollEvents.stop.join(' '), function() {
      clearInterval(self.gc.scrollTimer);
    });
    rightScroll.bind(scrollEvents.start.join(' '), function() {
      animScrollTo(9999);
    });
    rightScroll.bind(scrollEvents.stop.join(' '), function() {
      clearInterval(self.gc.scrollTimer);
    });

    if (quasar.runs.with.touch) {
      links
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
    }
  },
  destroyed: function() {
    quasar.events.off('app:page:ready', this.gc.autoSelectTab);

    if (this.gc.scrollTimer) {
      clearInterval(this.gc.scrollTimer);
    }
    this.gc.resizers.forEach(function(resize) {
      $(window).off('resize', resize);
    });
  }
});
