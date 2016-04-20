'use strict';

var template = require('raw!./pagination.html');

Vue.component('pagination', {
  template: template,
  props: {
    model: {
      type: Number,
      twoWay: true,
      required: true,
      coerce: function(value) {
        return parseInt(value, 10);
      }
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      rangeMode: false,
      newPage: ''
    };
  },
  methods: {
    changeModelByOffset: function(offset) {
      this.model = this.normalize(this.model + offset);
    },
    normalize: function(value) {
      return Math.min(this.max, Math.max(1, parseInt(value, 10)));
    }
  },
  computed: {
    inputPlaceholder: function() {
      return this.model + ' / ' + this.max;
    }
  },
  watch: {
    newPage: function(value) {
      if (value || value === 0) {
        this.model = this.normalize(value);
        this.newPage = '';
        $(this.$els.input).blur();
      }
    }
  }
});
