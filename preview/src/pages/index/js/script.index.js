'use strict';

module.exports = {
  template: require('raw!../html/view.index.html'),
  data: {
    msg: 'aaa'
  },
  methods: {
    myalert: function() {
      alert('aaa');
    }
  },
  ready: function() {
    console.log('Page index ready');
  },
  destroyed: function() {
    console.log('Page index destroyed');
  }
};
