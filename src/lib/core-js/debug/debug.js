'use strict';

var __profiler = {};

_.merge(quasar, {
  debug: {
    printStack: /* istanbul ignore next */ function() {
      var e = new Error('dummy');

      var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
        .replace(/^\s+at\s+/gm, '')
        .replace(/^Object.<anonymous>\s*\(/gm, '{anon}()@')
        .split('\n');

      console.log(stack);
    },
    profile: function(name, byNotify) {
      var message, fn = byNotify ? quasar.notify : console.log;

      if (__profiler.hasOwnProperty(name)) {
        fn('[profile end: ' + name + '] ' + (new Date().getTime() - __profiler[name]));
        delete __profiler[name];
        return;
      }

      __profiler[name] = new Date().getTime();
      fn('[profile start: ' + name + ']');
    }
  }
});
