'use strict';

var template = require('raw!./number.html');

Vue.component('number', Vue.extend({
  template: template,
  props: {
    model: {
      type: Number,
      default: 0,
      coerce: function(value) {
        return parseFloat(value, 10) || 0;
      }
    },
    step: {
      type: Number,
      default: 1,
      coerce: function(value) {
        return parseFloat(value, 10);
      }
    },
    lazy: {
      type: Boolean,
      default: true,
      coerce: function(value) {
        return value ? true : false;
      }
    },
    debounce: Number,
    min: Number,
    max: Number
  },
  watch: {
    model: function(value) {
      if (typeof this.min === 'number' && value < this.min) {
        this.model = this.min;
      }
      else if (typeof this.max === 'number' && value > this.max) {
        this.model = this.max;
      }
    }
  },
  methods: {
    increment: function(direction) {
      this.model += direction * this.step;
    }
  },
  compiled: function() {
    if (!this.lazy) {
      $(this.$el).find('input').attr('lazy', '');
    }
  }
}));
