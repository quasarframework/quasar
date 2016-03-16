'use strict';

var template = require('raw!./range.html');

function modelToPosition(model, min, max, size) {
  return (model - min) / (max - min) * 100 + '%';
}

Vue.component('range', {
  template: template,
  props: ['model', 'min', 'max', 'precision'],
  data: function() {
    return {
      position: 0,
      active: false
    };
  },
  methods: {
    pan: function(event) {
      var
        size = this.el.width(),
        range = this.max - this.min,
        value = (this.model - this.min) / range,
        percentage = Math.min(1, Math.max(0, value + event.deltaX / size)),
        newValue = (this.min + percentage * range).toFixed(this.precision)
        ;

      if (event.isFinal) {
        this.model = newValue;
        this.active = false;
        return;
      }

      this.position = modelToPosition(newValue, this.min, this.max, size);
      this.active = true;
    },
    update: function() {
      this.position = modelToPosition(this.model, this.min, this.max, this.el.width());
    }
  },
  watch: {
    model: function(value) {
      Vue.nextTick(this.update);
    },
    min: function(value) {
      if (this.model < value) {
        this.model = value;
        return;
      }
      Vue.nextTick(this.update);
    },
    max: function(value) {
      if (this.model > value) {
        this.model = value;
        return;
      }
      Vue.nextTick(this.update);
    }
  },
  ready: function() {
    this.el = $(this.$el);

    this.update = quasar.debounce(this.update, 50);
    this.update();

    if (quasar.runs.on.desktop) {
      this.el.click(function(event) {
        if (quasar.runs.with.touch && event.eventPhase === Event.BUBBLING_PHASE) {
          // panning already dealt with this;
          return;
        }

        var
          range = this.max - this.min,
          percentage = Math.min(1, Math.max(0, event.offsetX / this.el.width()))
          ;

        this.model = (this.min + percentage * range).toFixed(this.precision);
      }.bind(this));
    }
  }
});
