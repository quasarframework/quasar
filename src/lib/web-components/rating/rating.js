'use strict';

var template = require('raw!./rating.html');

Vue.component('rating', {
  template: template,
  props: {
    model: {
      type: Number,
      default: 0,
      required: true
    },
    maxGrade: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: 'grade'
    }
  },
  data: function() {
    return {
      mouseModel: 0
    };
  }
});
