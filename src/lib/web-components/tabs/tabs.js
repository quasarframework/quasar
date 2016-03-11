'use strict';

var
  scrollNavigationSpeed = 5, // in pixels
  debounceDelay = 50, // in ms
  template = $(require('raw!./tabs.html'))
  ;

Vue.component('tabs', {
  template: template.find('#tabs').html(),
  methods: {
    redraw: function() {
      var
        scrollPosition = 0,
        scroller = this.scroller[0]
        ;

      if (this.scroller.width() === 0 && scroller.scrollWidth === 0) {
        return;
      }
      if (this.scrollable) {
        scrollPosition = scroller.scrollLeft;
        this.nav.removeClass('scrollable');
        this.scrollable = false;
      }
      if (this.scroller.width() < scroller.scrollWidth) {
        this.nav.addClass('scrollable');
        scroller.scrollLeft = scrollPosition;
        this.scrollable = true;
        this.updateScrollIndicator();
      }
    },
    updateScrollIndicator: function() {
      if (!quasar.runs.on.desktop || !this.scrollable) {
        return;
      }

      var scroller = this.scroller[0];

      this.leftScroll[scroller.scrollLeft <= 0 ? 'addClass' : 'removeClass']('disabled');
      this.rightScroll[scroller.scrollLeft + this.scroller.innerWidth() + 5 >= scroller.scrollWidth ? 'addClass' : 'removeClass']('disabled');
    },
    scrollToSelectedIfNeeded: function(tab) {
      if (tab.length === 0 || !this.scrollable) {
        return;
      }

      var
        scroller = this.scroller[0],
        contentRect = scroller.getBoundingClientRect(),
        tabRect = tab[0].getBoundingClientRect(),
        tabWidth = tabRect.width,
        offset = tabRect.left - contentRect.left
        ;

      if (offset < 0) {
        this.animScrollTo(scroller.scrollLeft + offset);
      }
      else {
        offset += tabWidth - scroller.offsetWidth;
        /* istanbul ignore else */
        if (offset > 0) {
          this.animScrollTo(scroller.scrollLeft + offset);
        }
      }
    },
    animScrollTo: function(value) {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
      }

      this.scrollTowards(value);
      this.scrollTimer = setInterval(function() {
        if (this.scrollTowards(value)) {
          clearInterval(this.scrollTimer);
        }
      }.bind(this), 5);
    },
    scrollTowards: function(value) {
      var
        scroller = this.scroller[0],
        scrollPosition = scroller.scrollLeft,
        direction = value < scrollPosition ? -1 : 1,
        done = false
        ;

      scrollPosition += direction * scrollNavigationSpeed;

      if (scrollPosition < 0) {
        done = true;
        scrollPosition = 0;
      }
      else if (direction === -1 && scrollPosition <= value || direction === 1 && scrollPosition >= value) {
        done = true;
        scrollPosition = value;
      }

      scroller.scrollLeft = scrollPosition;
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
      }.bind(this), debounceDelay * 4);
    },
    hidden: function() {
      this.redraw();
    }
  },
  ready: function() {
    var self = this;

    this.scrollTimer = null;
    this.scrollable = false;

    this.nav = $(this.$el);
    this.scroller = this.nav.find('.tabs-scroller');
    this.leftScroll = this.nav.find('.left-scroll');
    this.rightScroll = this.nav.find('.right-scroll');
    this.tabs = this.scroller.find('.tab');

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.redraw = quasar.debounce(this.redraw, debounceDelay);
    this.updateScrollIndicator = quasar.debounce(this.updateScrollIndicator, debounceDelay);

    this.content = $(this.$children.filter(function($child) {
      return $child.target;
    }).map(function($child) {
      return $child.target;
    }).join(','));
    this.content.css('display', 'none');

    this.scroller.scroll(this.updateScrollIndicator);
    $(window).resize(this.redraw);

    // let browser drawing stabilize then
    setTimeout(function() {
      self.redraw();
      quasar.events.on('app:page:ready', self.redraw);
    }, debounceDelay);

    if (quasar.runs.on.desktop) {
      var scrollEvents = {
        start: [],
        stop: []
      };

      scrollEvents.start.push('mousedown');
      scrollEvents.stop.push('mouseup');

      if (quasar.runs.with.touch) {
        scrollEvents.start.push('touchstart');
        scrollEvents.stop.push('touchend');
      }

      this.leftScroll.bind(scrollEvents.start.join(' '), function() {
        self.animScrollTo(0);
      });
      this.leftScroll.bind(scrollEvents.stop.join(' '), function() {
        clearInterval(self.scrollTimer);
      });
      this.rightScroll.bind(scrollEvents.start.join(' '), function() {
        self.animScrollTo(9999);
      });
      this.rightScroll.bind(scrollEvents.stop.join(' '), function() {
        clearInterval(self.scrollTimer);
      });
    }

    if (quasar.runs.with.touch) {
      this.tabs.each(function() {
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
  beforeDestroy: function() {
    if (this.scrollTimer) {
      clearInterval(this.scrollTimer);
    }
    this.scroller.off('scroll', this.updateScrollIndicator);
    $(window).off('resize', this.redraw);
    quasar.events.off('app:page:ready', this.redraw);
    if (quasar.runs.with.touch) {
      this.tabs.each(function() {
        $(this).getHammer().destroy();
      });
    }
    this.leftScroll.off();
    this.rightScroll.off();
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
    },
    hidden: function(value) {
      this.$dispatch('hidden');
    }
  }
});
