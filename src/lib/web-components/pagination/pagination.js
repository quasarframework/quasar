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
      return Math.min(this.max, Math.max(1, value));
    }
  },
  computed: {
    inputPlaceholder: function() {
      return this.model + ' / ' + this.max;
    }
  },
  watch: {
    newPage: function(value) {
      var parsed = parseInt(value, 10);

      if (parsed) {
        this.model = this.normalize(parsed);
        $(this.$els.input).blur();
      }

      this.newPage = '';
    }
  }
});
