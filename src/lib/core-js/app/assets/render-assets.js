'use strict';

function injectVue(currentVue, el, readyFunction) {
  var vue = $.extend(true, {}, currentVue);

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

    if (Object.keys(vue).length === 0) {
      delete quasar[type].vm;
      $(el).html('<div class="quasar-page"></div>');
      done && done();
      return;
    }

    var template = $(vue.template);

    if (template.find('quasar-navigation').length === 0) {
      var ios = quasar.runs.on.ios;

      template.find('.quasar-screen-' + (ios ? 'footer' : 'header'))[ios ? 'prepend' : 'append']('<quasar-navigation></quasar-navigation>');
      vue.template = template[0].outerHTML;
    }
  }

  quasar[type].vm = new Vue(injectVue(vue, el, done));
};
