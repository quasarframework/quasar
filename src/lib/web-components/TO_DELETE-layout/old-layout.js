'use strict';

var
  rowHeight = 55
  ;

/*
 * Quasar Page
 */

Vue.component('quasar-screen', {
  ready: function() {
    var
      layout = $(this.$el),
      header = layout.find('.quasar-header'),
      page = layout.find('.quasar-page'),
      footer = layout.find('.quasar-footer'),
      drawer = layout.find('.drawer-content'),
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
      quasar.events.on('app:page:ready', this.gc.marginalsHeightChanged);
    }

    manager.withEmpty('scroll-shadow shadow', function(type) {
      if (type === 'shadow') {
        header.addClass('shadow');
        return;
      }

      if (!manager.hasEmpty('keep-header retract-header keep-navigation keep-marginals shrink-header')) {
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

      quasar.events.on('app:page:ready', this.gc.marginalsHeightChanged);
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

      quasar.events.on('app:page:ready', this.gc.marginalsHeightChanged);
    }.bind(this));

    var retract = function(minHeightFn) {
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
          translate = Math.max(0, Math.min(minHeightFn(), lastTranslate + delta))
          ;

        header.css({'transform': 'translate3d(0,-' + translate + 'px, 0)'});
        drawer.css('top', headerHeight - translate + 'px');
        lastOffset = offset;
        lastTranslate = translate;
      };

      $(window).scroll(scrollFn);
      this.gc.scrolls.push([$(window), scrollFn]);

      quasar.events.on('app:page:ready', this.gc.marginalsHeightChanged);
    }.bind(this);

    manager.withEmpty('retract-header', function() {
      retract(function() {return headerHeight;});
    });

    manager.withEmpty('keep-navigation', function() {
      retract(function() {return header.find('.quasar-row.quasar-navigation').height();});
    });
  },
  destroyed: function() {
    quasar.events.off('app:page:ready', this.gc.marginalsHeightChanged);
    this.gc.scrolls.forEach(function(scroll) {
      scroll[0].off('scroll', scroll[1]);
    });
  }
});
