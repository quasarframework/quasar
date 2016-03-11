'use strict';

var now = Date.now;

module.exports = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    }
    else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      }
    }
  };

  return function() {
    var callNow = immediate && !timeout;

    context = this;
    args = arguments;
    timestamp = now();

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};
