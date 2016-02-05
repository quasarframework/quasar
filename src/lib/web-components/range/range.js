'use strict';

var template = require('raw!./range.html');

function modelToPosition(model, min, max, size) {
  return (model - min) / (max - min) * size;
}

Vue.component('quasar-range', {
  template: template,
  props: ['model', 'min', 'max', 'precision'],
  data: function() {
    return {
      position: 0,
      tooltip: ''
    };
  },
  methods: {
    pan: function(event) {
      var
        size = this.el.width() - 21,
        range = this.max - this.min,
        value = (this.model - this.min) / range,
        percentage = Math.min(1, Math.max(0, value + event.deltaX / size)),
        newValue = (this.min + percentage * range).toFixed(this.precision)
        ;

      this.position = percentage * size;
      this.tooltip = newValue;

      if (event.isFinal) {
        this.model = newValue;
      }
    }
  },
  watch: {
    model: function(value) {
      this.position = modelToPosition(value, this.min, this.max, this.el.width() - 21);
    },
    min: function(value) {
      if (this.model < value) {
        this.model = value;
        return;
      }
      this.position = modelToPosition(this.model, value, this.max, this.el.width() - 21);
    },
    max: function(value) {
      if (this.model > value) {
        this.model = value;
        return;
      }
      this.position = modelToPosition(this.model, this.min, value, this.el.width() - 21);
    }
  },
  ready: function() {
    this.el = $(this.$el);
    this.tooltip = this.model;

    this.gc = {
      update: function() {
        this.position = modelToPosition(this.model, this.min, this.max, this.el.width() - 21);
      }.bind(this)
    };

    $(window).resize(this.gc.update);
    this.gc.update();
  },
  destroy: function() {
    $(window).off('resize', this.gc.update);
  }
});
