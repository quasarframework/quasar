'use strict';

var template = require('raw!./parallax.html');

Vue.component('parallax', {
  template: template,
  props: {
    src: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data: function() {
    return {
      ready: false,
      imageOffset: 0
    };
  },
  watch: {
    src: function() {
      this.ready = false;
    },
    height: function() {
      this.updatePosition();
    }
  },
  methods: {
    processImage: function() {
      this.ready = true;
      this.processResize();
    },
    processResize: function() {
      if (!this.ready) {
        return;
      }

      this.image.css('min-height', Math.max(this.height, this.pageContainer.innerHeight()));
      this.imageHeight = this.image.height();

      this.updatePosition();
    },
    updatePosition: function() {
      if (!this.ready) {
        return;
      }

      var
        containerTop = this.pageContainer.offset().top,
        containerHeight = this.pageContainer.innerHeight(),
        containerBottom = containerTop + containerHeight,

        top = this.container.offset().top,
        bottom = top + this.height
        ;

      if (bottom > containerTop && top < containerBottom) {
        this.imageOffset = Math.round(containerTop - top + (containerHeight - this.imageHeight) / 2);
      }
    }
  },
  ready: function() {
    var self = this;

    this.container = $(this.$el);
    this.image = $(this.$els.img);

    quasar.events.once('app:page:ready', function(page) {
      self.pageName = page.name;
      self.$nextTick(function() {
        self.pageContainer = quasar.current.page.scrollContainer;
        self.pageContainer.scroll(self.updatePosition);
      });
    });

    this.onPageReady = function(page) {
      if (page.name === self.pageName) {
        self.processResize();
        $(window).resize(self.processResize);
      }
      else {
        $(window).off('resize', self.processResize);
      }
    };
    quasar.events.on('app:page:ready', this.onPageReady);
  },
  beforeDestroy: function() {
    $(window).off('resize', this.processResize);
    this.pageContainer.off('scroll', this.updatePosition);
    quasar.events.off('app:page:ready', this.onPageReady);
  }
});
