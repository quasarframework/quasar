'use strict';

module.exports.vue = function() {
  return {
    data: {
      msg: 'aaa'
    },
    methods: {
      myalert: function() {
        alert('aaa');
      }
    }
  };
};

module.exports.start = function() {
};
