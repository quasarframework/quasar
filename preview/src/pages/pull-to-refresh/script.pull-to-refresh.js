'use strict';

var html = require('raw!./view.pull-to-refresh.html');

var loremipsum = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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
