'use strict';

var __profiler = {};

function notify(byNotify, message) {
  if (byNotify) {
    quasar.notify(message);
    return;
  }

  console.log(message);
}

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
      if (__profiler.hasOwnProperty(name)) {
        notify(byNotify, '[profile end: ' + name + '] ' + (new Date().getTime() - __profiler[name]));
        delete __profiler[name];
        return;
      }

      __profiler[name] = new Date().getTime();
      notify(byNotify, '[profile start: ' + name + ']');
    }
  }
});
