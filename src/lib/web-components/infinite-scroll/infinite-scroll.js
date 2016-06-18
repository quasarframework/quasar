'use strict';

var template = require('raw!./infinite-scroll.html');

Vue.component('infinite-scroll', {
  template: template,
  props: {
    handler: {
      type: Function,
      required: true
    },
    inline: {
      type: Boolean,
      default: false,
      coerce: function(value) {
        return !!value;
      }
    }
  },
  data: function() {
    return {
      index: 0,
      refreshing: false
    };
  },
  methods: {
    scroll: function() {
      if (this.refreshing) {
        return;
      }

      var
        windowHeight = this.scrollContainer.innerHeight(),
        containerBottom = this.scrollContainer.offset().top + windowHeight,
        triggerPosition = this.element.offset().top + this.element.height() - windowHeight
        ;

      if (triggerPosition < containerBottom) {
        this.index++;
        this.refreshing = true;
        this.handler(this.index, function() {
          this.refreshing = false;
          this.scroll();
        }.bind(this));
      }
    }
  },
  ready: function() {
    this.scroll = quasar.debounce(this.scroll, 50);
    this.element = $(this.$els.content);

    this.scrollContainer = this.inline ? $(this.$el) : this.element.parents('.quasar-page-container');
    this.scrollContainer.scroll(this.scroll);

    this.scroll();
  },
  destroy: function() {
    this.scrollContainer.off('scroll', this.scroll);
  }
});
