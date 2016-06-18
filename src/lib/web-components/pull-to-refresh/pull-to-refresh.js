'use strict';

var template = require('raw!./pull-to-refresh.html');

Vue.component('pull-to-refresh', {
  template: template,
  props: {
    handler: {
      type: Function,
      required: true
    },
    distance: {
      type: Number,
      default: 35
    },
    pullMessage: {
      type: String,
      default: 'Pull down to refresh'
    },
    releaseMessage: {
      type: String,
      default: 'Release to refresh'
    },
    refreshMessage: {
      type: String,
      default: 'Refreshing...'
    },
    refreshIcon: {
      type: String,
      default: 'refresh'
    }
  },
  data: function() {
    var height = 65;

    return {
      state: 'pull',
      pullPosition: - height,
      height: height,
      animating: false,
      pulling: false,
      scrolling: false
    };
  },
  methods: {
    pull: function(hammer) {
      if (this.scrolling) {
        if (hammer.isFinal) {
          this.scrolling = false;
        }
        return;
      }
      if (this.animating) {
        return;
      }

      if (!this.pulling) {
        if (this.state === 'refreshing') {
          return;
        }
        if (this.pullPosition === - this.height && hammer.direction === Hammer.DIRECTION_UP) {
          return;
        }

        var
          containerTop = this.scrollContainer.offset().top,
          thisContainerTop = this.container.offset().top
          ;

        if (containerTop > thisContainerTop) {
          this.scrolling = true;
          return;
        }

        this.originalScrollOverflow = this.scrollContainer.css('overflow');
        this.scrollContainer.css('overflow', 'hidden');
      }

      this.pulling = true;
      this.pullPosition = - this.height + Math.max(0, Math.pow(hammer.deltaY, 0.85));

      if (this.pullPosition > this.distance) {
        if (hammer.isFinal) {
          this.state = 'refreshing';
          this.pulling = false;
          this.scrollContainer.css('overflow', this.originalScrollOverflow);
          this.animateTo(0);
          this.trigger();
        }
        else {
          this.state = 'pulled';
        }
      }
      else {
        this.state = 'pull';
        if (hammer.isFinal) {
          this.pulling = false;
          this.scrollContainer.css('overflow', this.originalScrollOverflow);
          this.animateTo(- this.height);
        }
      }
    },
    animateTo: function(target, done, previousCall) {
      var self = this;

      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating);
      }

      this.pullPosition -= (this.pullPosition - target) / 7;

      if (this.pullPosition - target > 1) {
        this.animating = requestAnimationFrame(function() {
          self.animateTo(target, done, true);
        });
      }
      else {
        this.animating = requestAnimationFrame(function() {
          self.pullPosition = target;
          self.animating = false;
          done && done();
        });
      }
    },
    trigger: function() {
      var self = this;

      this.handler(function() {
        self.animateTo(- self.height, function() {
          self.state = 'pull';
        });
      });
    }
  },
  ready: function() {
    this.container = $(this.$el);

    var scrollContainer = this.container.parent();

    if (scrollContainer.hasClass('quasar-page')) {
      scrollContainer = scrollContainer.parent();
    }

    this.scrollContainer = scrollContainer;
  }
});
