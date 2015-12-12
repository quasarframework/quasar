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
    if (quasar.global[argument].vm) {
      quasar.global[argument].vm.$destroy();
    }
  });
}

module.exports.layout = function(layoutVue, done) {
  destroyVue('page', 'layout');
  quasar.global.layout.vm = new Vue(injectVue(layoutVue, '#quasar-app', done));
};

module.exports.page = function(pageVue, done) {
  destroyVue('page');
  quasar.global.page.vm = new Vue(injectVue(pageVue, '.quasar-page', done));
};
