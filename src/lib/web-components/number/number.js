'use strict';

var template = require('raw!./number.html');


var inputVM = {
  props: {
    model: {},
    debounce: Number
  },
  beforeCompile: function() {
    var el = $(this.$el);

    el.getAttributesManager()
    .with('inline', function() {
      el.addClass('inline');
    })
    .with('lazy', function() {
      el.find('> .quasar-input-field').attr('lazy', '');
    });
  }
};

Vue.component('quasar-number', Vue.extend({
  mixins: [inputVM],
  template: template,
  props: {
    model: {
      type: Number,
      default: 0,
      coerce: function(value) {
        return parseFloat(value, 10);
      }
    },
    step: {
      type: Number,
      default: 1,
      coerce: function(value) {
        return parseFloat(value, 10);
      }
    },
    min: Number,
    max: Number
  },
  watch: {
    model: function(value) {
      if (_.isNumber(this.min) && value < this.min) {
        this.model = this.min;
      }
      else if (_.isNumber(this.max) && value > this.max) {
        this.model = this.max;
      }
    }
  },
  methods: {
    increment: function(step) {
      this.model += step;
    }
  }
}));
