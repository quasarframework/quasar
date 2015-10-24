'use strict';

var __profiler = {};

var debug = {
  printStack: /* istanbul ignore next */ function() {
    var e = new Error('dummy');

    var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
      .replace(/^\s+at\s+/gm, '')
      .replace(/^Object.<anonymous>\s*\(/gm, '{anon}()@')
      .split('\n');

    console.log(stack);
  },
  profile: function(name) {
    if (__profiler.hasOwnProperty(name)) {
      console.log('[profile end: ' + name + ']', new Date().getTime() - __profiler[name]);
      delete __profiler[name];
      return;
    }

    __profiler[name] = new Date().getTime();
    console.log('[profile start: ' + name + ']');
  }
};

module.exports = {
  debug: debug
};
