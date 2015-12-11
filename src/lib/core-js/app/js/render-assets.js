'use strict';

function injectVue(currentVue, el, readyFunction) {
  console.log('injectVue 1');
  var vue = _.merge({}, currentVue);

  vue.el = el;
  vue.replace = false;

  /* istanbul ignore next */
  if (!readyFunction) {
    return vue;
  }

  console.log('injectVue 2');
  if (!vue.ready) {
    vue.ready = readyFunction;
    return vue; // <<< EARLY EXIT
  }

  var originalReadyFunction = vue.ready;

  console.log('injectVue 3');
  vue.ready = function() {
    console.log('vue ready()', el);
    originalReadyFunction.call(this);
    console.log('vue call after ready()', el);
    readyFunction.call(this);
  };

  console.log('injectVue 4');
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
  console.log('before layout()', $('#quasar-app').html());
  quasar.global.layout.vm = new Vue(injectVue(layoutVue, '#quasar-app', done));
  console.log('after layout()', $('#quasar-app').html());
};

module.exports.page = function(pageVue, done) {
  destroyVue('page');
  console.log('before page()');
  quasar.global.page.vm = new Vue(injectVue(pageVue, '.quasar-page', done));
  console.log('after page()');
};
