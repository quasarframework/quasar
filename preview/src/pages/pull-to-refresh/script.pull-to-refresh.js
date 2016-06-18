'use strict';

var html = require('raw!./view.pull-to-refresh.html');

module.exports = {
  template: html,
  data: {
    items: [{}, {}, {}, {}, {}, {}]
  },
  methods: {
    refresher: function(done) {
      setTimeout(function() {
        done();
        this.items.unshift({});
      }.bind(this), 3000);
    }
  }
};
