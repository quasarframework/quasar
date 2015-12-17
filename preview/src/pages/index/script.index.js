'use strict';

module.exports = {
  template: require('raw!./view.index.html'),
  data: {
    msg: 'aaa'
  },
  methods: {
    myalert: function() {
      alert('aaa');
    },
    tapped: function() {
      alert('tapped');
    },
    panned: function(args) {
      console.log('panned', args.deltaX, args.deltaY);
    }
  },
  ready: function() {
    console.log('Page index ready');
  },
  destroyed: function() {
    console.log('Page index destroyed');
  }
};
