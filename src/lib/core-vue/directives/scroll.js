'use strict';

Vue.directive('scroll', {
  bind: function() {
    var self = this;

    this.element = $(this.el);
    this.scroll = function() {};

    quasar.events.once('app:page:ready', function(page) {
      self.pageName = page.name;
      Vue.nextTick(function() {
        self.pageContainer = quasar.current.page.scrollContainer;
        self.pageContainer.scroll(self.scroll);
      });
    });
  },
  update: function(handler) {
    if (typeof handler !== 'function') {
      this.scroll = $.noop;
      console.error('v-scroll requires a function as parameter', this.el);
      return;
    }

    this.scroll = function() {
      handler(this.pageContainer.scrollTop());
    }.bind(this);
  },
  unbind: function() {
    this.pageContainer.off('scroll', this.scroll);
  }
});

Vue.directive('scroll-fire', {
  bind: function() {
    var self = this;

    this.element = $(this.el);
    this.scroll = function() {};

    quasar.events.once('app:page:ready', function(page) {
      self.pageName = page.name;
      Vue.nextTick(function() {
        self.pageContainer = quasar.current.page.scrollContainer;
        self.pageContainer.scroll(self.scroll);
      });
    });
  },
  update: function(handler) {
    if (typeof handler !== 'function') {
      this.scroll = $.noop;
      console.error('v-scroll-fire requires a function as parameter', this.el);
      return;
    }

    this.scroll = quasar.debounce(function() {
      var
        containerBottom = this.pageContainer.offset().top + this.pageContainer.innerHeight(),
        elementBottom = this.element.offset().top + this.element.height()
        ;

      if (elementBottom < containerBottom) {
        this.pageContainer.off('scroll', this.scroll);
        handler();
      }
    }.bind(this), 50);
  },
  unbind: function() {
    this.pageContainer.off('scroll', this.scroll);
  }
});

/*
Vue.directive('scroll-sticky', {
  bind: function() {
    var self = this;

    this.element = $(this.el);
    this.position = this.element.offset().top;
    this.scroll = function() {};

    quasar.events.once('app:page:ready', function(page) {
      self.pageName = page.name;
      Vue.nextTick(function() {
        self.pageContainer = quasar.current.page.scrollContainer;
        self.pageContainer.scroll(self.scroll);
      });
    });
  },
  update: function(options) {
    if (false && options !== Object(options)) {
      this.scroll = $.noop;
      console.error('v-scroll requires an Object as parameter', this.el);
      return;
    }

    this.scroll = function() {
      if (options.top >= this.element.offset().top) {
        console.log('hit');
        this.element.css({
          position: 'fixed',
          top: options.hasOwnProperty('offsetTop') ? options.offsetTop : this.position,
          right: options.offsetRight
        });
      }
      else {
        console.log('miss', options.top, this.element.offset().top);
        this.element.css('position', '');
      }
    }.bind(this);
  },
  unbind: function() {
    this.pageContainer.off('scroll', this.scroll);
  }
});
*/
