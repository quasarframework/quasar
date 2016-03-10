'use strict';

var
  scrollNavigationSpeed = 5, // in pixels
  template = $(require('raw!./tabs.html'))
  ;

Vue.component('tabs', {
  template: template.find('#tabs').html(),
  methods: {
    updateScrollIndicator: function() {
      this.nav.addClass('scrollable');
      if (this.scroller.width() + 2 * this.leftScroll.width() >= this.scroller[0].scrollWidth) {
        this.nav.removeClass('scrollable');
      }

      this.leftScroll.removeClass('disabled');
      this.rightScroll.removeClass('disabled');
      if (this.scroller.scrollLeft() <= 0) {
        this.leftScroll.addClass('disabled');
      }
      if (this.scroller.scrollLeft() + this.scroller.innerWidth() + 5 >= this.scroller[0].scrollWidth) {
        this.rightScroll.addClass('disabled');
      }
    },
    scrollToSelectedIfNeeded: function(tab) {
      if (tab.length === 0 || !this.nav.hasClass('scrollable')) {
        return;
      }

      var contentRect = this.scroller[0].getBoundingClientRect();
      var tabRect = tab[0].getBoundingClientRect();

      var tabWidth = tabRect.width;
      var offset = tabRect.left - contentRect.left;

      if (offset < 0) {
        this.animScrollTo(this.scroller[0].scrollLeft + offset);
      }
      else {
        offset += tabWidth - this.scroller[0].offsetWidth;
        /* istanbul ignore else */
        if (offset > 0) {
          this.animScrollTo(this.scroller[0].scrollLeft + offset);
        }
      }
    },
    animScrollTo: function(value) {
      if (this.gc.scrollTimer) {
        clearInterval(this.gc.scrollTimer);
      }

      this.scrollTowards(value);
      this.gc.scrollTimer = setInterval(function() {
        if (this.scrollTowards(value)) {
          clearInterval(this.gc.scrollTimer);
        }
      }.bind(this), 5);
    },
    scrollTowards: function(value) {
      var
        scroll = this.scroller[0].scrollLeft,
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

      this.scroller[0].scrollLeft = scroll;
      return done;
    }
  },
  events: {
    selected: function(tab, tabNode) {
      this.content.css('display', 'none');
      $(tab.target).css('display', '');

      this.$broadcast('blur', tab);

      setTimeout(function() {
        this.scrollToSelectedIfNeeded(tabNode);
      }.bind(this), 50);
    }
  },
  ready: function() {
    var self = this;

    this.gc = {
      scrollTimer: null,
      resizers: []
    };

    this.nav = $(this.$el).find('.tabs');
    this.scroller = this.nav.find('.tabs-scroller');
    this.leftScroll = this.nav.find('.left-scroll');
    this.rightScroll = this.nav.find('.right-scroll');
    this.links = this.scroller.find('.tab');

    this.content = $(this.$children.filter(function($child) {
      return $child.target;
    }).map(function($child) {
      return $child.target;
    }).join(','));

    this.content.css('display', 'none');
    this.scroller.scroll(this.updateScrollIndicator);
    $(window).resize(this.updateScrollIndicator);
    this.gc.resizers.push(this.updateScrollIndicator);
    quasar.events.on('app:page:ready', this.updateScrollIndicator);

    quasar.nextTick(function() {
      self.updateScrollIndicator();
    });

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
    this.leftScroll.bind(scrollEvents.start.join(' '), function() {
      self.animScrollTo(0);
    });
    this.leftScroll.bind(scrollEvents.stop.join(' '), function() {
      clearInterval(self.gc.scrollTimer);
    });
    this.rightScroll.bind(scrollEvents.start.join(' '), function() {
      self.animScrollTo(9999);
    });
    this.rightScroll.bind(scrollEvents.stop.join(' '), function() {
      clearInterval(self.gc.scrollTimer);
    });

    if (quasar.runs.with.touch) {
      this.links
        .each(function() {
          var hammer = $(this).hammer().getHammer();
          var lastOffset = 0;

          hammer.on('panmove', function(ev) {
            self.scroller[0].scrollLeft += lastOffset - ev.deltaX;
            lastOffset = ev.deltaX;
          });
          hammer.on('panend', function() {
            lastOffset = 0;
          });
        });
    }
  },
  destroyed: function() {
    if (this.gc.scrollTimer) {
      clearInterval(this.gc.scrollTimer);
    }
    this.gc.resizers.forEach(function(resize) {
      $(window).off('resize', resize);
    });
    quasar.events.off('app:page:ready', this.updateScrollIndicator);
  }
});

Vue.component('tab', {
  template: template.find('#tab').html(),
  props: ['active', 'hidden', 'disabled', 'hide', 'icon', 'label', 'target'],
  methods: {
    activate: function() {
      if (this.disabled) {
        return;
      }
      this.active = true;
    }
  },
  events: {
    blur: function(tab) {
      if (tab === this) {
        return;
      }
      this.active = false;
    }
  },
  watch: {
    active: function(value) {
      if (this.disabled) {
        return;
      }
      if (value) {
        this.$dispatch('selected', this, $(this.$el));
      }
    }
  }
});
