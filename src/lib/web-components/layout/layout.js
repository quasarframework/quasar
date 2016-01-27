'use strict';

var
  rowHeight = 55,
  template = $(require('raw!./layout.html'))
  ;

/*
 * Quasar Page
 */

Vue.component('quasar-layout', {
  template: template.find('#quasar-layout').html(),
  ready: function() {
    var
      layout = $(this.$el),
      header = layout.find('.quasar-header'),
      page = layout.find('.quasar-page'),
      footer = layout.find('.quasar-footer'),
      drawer = layout.find('.quasar-drawer-content'),
      manager = layout.getAttributesManager(),
      headerHeight = header.height(),
      update = {
        drawerTop: false,
        drawerBottom: false,
        pageTop: false,
        pageBottom: false
      };

    this.gc = {
      scrolls: [],
      marginalsHeightChanged: function() {
        Vue.nextTick(function() {
          $(window).scrollTop(0);
          quasar.nextTick(function() {
            if (update.drawerTop) {
              header.css('height', '');
              drawer.css('top', header.height() + 'px');
              headerHeight = header.height();
            }
            if (update.drawerBottom) {
              footer.css('height', '');
              drawer.css('bottom', footer.height() + 'px');
            }
            if (update.pageTop) {
              page.css('padding-top', header.height() + 20 + 'px');
            }
            if (update.pageBottom) {
              page.css('padding-bottom', footer.height() + 20 + 'px');
            }
          });
        });
      }
    };

    if (footer.length > 0 && !manager.hasEmpty('keep-marginals')) {
      update.pageBottom = true;
      page.css('padding-bottom', footer.height() + 20 + 'px');

      footer.addClass('fixed-bottom');
      update.drawerBottom = true;
      drawer.css('bottom', footer.height() + 'px');
      quasar.events.on('app:page:ready app:layout:update', this.gc.marginalsHeightChanged);
    }

    manager.withEmpty('scroll-shadow shadow', function(type) {
      if (type === 'shadow') {
        header.addClass('shadow');
        return;
      }

      if (!manager.hasEmpty('keep-header retract-header keep-marginals shrink-header')) {
        return;
      }

      var target = manager.hasEmpty('keep-marginals') ? page : $(window);

      var scrollFn = function() {
        header[target.scrollTop() > 0 ? 'addClass' : 'removeClass']('shadow');
      };

      target.scroll(scrollFn);
      this.gc.scrolls.push([target, scrollFn]);
    }.bind(this));

    manager.withEmpty('keep-header', function() {
      header.addClass('fixed-top');

      update.drawerTop = true;
      drawer.css('top', header.height() + 'px');

      update.pageTop = true;
      page.css('padding-top', header.height() + 20 + 'px');

      quasar.events.on('app:page:ready app:layout:update', this.gc.marginalsHeightChanged);
    }.bind(this));

    manager.withEmpty('keep-marginals', function() {
      layout.addClass('fixed-top layout vertical window-height');
      page.addClass('scroll flex window-height');
    });

    manager.withEmpty('shrink-header', function() {
      var scrollFn;

      header.addClass('fixed-top');

      update.pageTop = true;
      page.css('padding-top', headerHeight + 20 + 'px');

      update.drawerTop = true;
      drawer.css('top', headerHeight + 'px');

      scrollFn = function() {
        var
          offset = $(window).scrollTop(),
          translate = Math.min(headerHeight, offset),
          distance = Math.max(rowHeight, headerHeight - Math.min(headerHeight, offset))
          ;

        drawer.css('top', distance + 'px');
        header.css('height', distance + 'px');
        header.find('.quasar-row:not(:first-of-type)').css('display', offset > 0 ? 'none' : '');
      };

      $(window).scroll(scrollFn);
      this.gc.scrolls.push([$(window), scrollFn]);

      quasar.events.on('app:page:ready app:layout:update', this.gc.marginalsHeightChanged);
    }.bind(this));

    manager.withEmpty('retract-header', function() {
      header.addClass('fixed-top');

      update.pageTop = true;
      page.css('padding-top', header.height() + 20 + 'px');

      var
        scrollFn,
        lastOffset = 0,
        lastTranslate = 0
        ;

      update.drawerTop = true;
      drawer.css('top', headerHeight + 'px');

      scrollFn = function() {
        var
          offset = $(window).scrollTop(),
          delta = offset - lastOffset,
          translate = Math.max(0, Math.min(headerHeight, lastTranslate + delta))
          ;

        header.css({'transform': 'translate3d(0,-' + translate + 'px, 0)'});
        drawer.css('top', headerHeight - translate + 'px');
        lastOffset = offset;
        lastTranslate = translate;
      };

      $(window).scroll(scrollFn);
      this.gc.scrolls.push([$(window), scrollFn]);

      quasar.events.on('app:page:ready app:layout:update', this.gc.marginalsHeightChanged);
    }.bind(this));
  },
  destroyed: function() {
    quasar.events.off('app:page:ready app:layout:update', this.gc.marginalsHeightChanged);
    _.forEach(this.gc.scrolls, function(scroll) {
      scroll[0].off('scroll', scroll[1]);
    });
  }
});

/*
 * Quasar Content
 */

Vue.component('quasar-page', {
  template: template.find('#quasar-page').html()
});

/*
 * Quasar Headers
 */

Vue.component('quasar-header', {
  template: template.find('#quasar-header').html()
});


Vue.component('quasar-toolbar-button', {
  template: '<div class="quasar-toolbar-button"><slot></slot></div>'
});

Vue.component('quasar-row', {
  template: template.find('#quasar-row').html()
});

Vue.component('quasar-title', {
  template: template.find('#quasar-title').html()
});

Vue.component('quasar-footer', {
  template: template.find('#quasar-footer').html()
});


Vue.component('quasar-navigation', {
  template: template.find('#quasar-navigation').html(),
  data: function() {
    var links = _.filter(quasar.data.manifest.pages, function(page) {
      return page.navigation;
    });

    return {
      page: '',
      group: '',
      manual: false,
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
        (route ? '/' + route : '')
      );
    }
  },
  ready: function() {
    var
      nav = $(this.$el),
      manager = nav.getAttributesManager(),
      scroller = nav.find('> .quasar-navigation-container'),
      content = scroller.find('> .quasar-navigation-content'),
      leftScroll = nav.find('> .left-scroll'),
      rightScroll = nav.find('> .right-scroll'),
      links = content.find('.quasar-navigation-link')
      ;

    manager.with('manual', function() {
      this.manual = true;
    }.bind(this));

    this.gc = {
      resizers: []
    };

    function scrollToSelectedIfNeeded(tab) {
      if (!nav.hasClass('scrollable')) {
        return;
      }

      var contentRect = content[0].getBoundingClientRect();
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

    quasar.nextTick(function() {
      updateScrollIndicator();
    });

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
        hammer.on('panend', function(ev) {
          lastOffset = 0;
        });
      });
  },
  destroyed: function() {
    quasar.events.off('app:page:ready', this.gc.autoSelectTab);

    _.forEach(this.gc.resizers, function(resize) {
      resize[0].off('resize', resize[1]);
    });
  }
});

Vue.component('quasar-navigation-link', {
  template: template.find('#quasar-navigation-link').html()
});
