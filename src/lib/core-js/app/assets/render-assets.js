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

function destroyVue(instance) {
  if (quasar[instance].vm) {
    quasar[instance].vm.$destroy();
  }
}

module.exports = function(type, vue, done) {
  var el = '.quasar-page';

  destroyVue('page');
  if (type === 'layout') {
    el = '#quasar-app';
    destroyVue('layout');

    if (_.isEqual(vue, {})) {
      $(el).html('<div class="quasar-page"></div>');
      done && done();
      return;
    }
  }

  quasar[type].vm = new Vue(injectVue(vue, el, done));
};
