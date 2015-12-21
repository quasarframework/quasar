'use strict';

function injectVue(currentVue, el, readyFunction) {
  var vue = _.merge({}, currentVue);

  vue.el = el;
  vue.replace = false;

  /* istanbul ignore next */
  if (!readyFunction) {
    return vue;
  }

  if (!vue.ready) {
    vue.ready = readyFunction;
    return vue; // <<< EARLY EXIT
  }

  var originalReadyFunction = vue.ready;

  vue.ready = function() {
    originalReadyFunction.call(this);
    readyFunction.call(this);
  };

  return vue;
}

function destroyVue() {
  _.forEach(arguments, function(argument) {
    if (quasar[argument].vm) {
      quasar[argument].vm.$destroy();
    }
  });
}

module.exports = function(type, vue, done) {
  destroyVue('page');
  if (type === 'layout') {
    destroyVue('layout');
  }

  q[type].vm = new Vue(injectVue(vue, type === 'layout' ? '#quasar-app' : '.quasar-page', done));
};
