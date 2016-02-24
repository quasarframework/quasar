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

function injectNavigation(vue) {
  var template = $(vue.template);

  if (template.find('quasar-navigation').length === 0) {
    var ios = quasar.runs.on.ios;

    template[ios ? 'prepend' : 'append']('<quasar-navigation slot="' + (ios ? 'footer' : 'header') + '"><quasar-navigation></quasar-navigation>');
    vue.template = template[0].outerHTML;
  }
}

module.exports.layout = function(vue, done) {
  var el = '#quasar-app';

  if (quasar.page.length > 0) {
    Object.keys(quasar.page).forEach(function(page) {
      quasar.page[page].vm.$destroy(true);
    });
  }
  if (quasar.layout.vm) {
    quasar.layout.vm.$destroy();
  }

  if (Object.keys(vue).length === 0) {
    delete quasar.layout.vm;
    $(el).html('<div class="quasar-pages"></div>');
    done && done();
    return;
  }

  injectNavigation(vue);

  quasar.layout.vm = new Vue(injectVue(vue, el, done));
};

module.exports.page = function(vue, context, done) {
  var
    el = '[data-page="' + context.identification + '"]',
    container = $(el),
    pageContainers = $('.quasar-page-container'),
    newPage = $(
      '<div class="quasar-page-container" data-page="' +
      context.identification +
      '"><div class="quasar-page"></div></div>'
    );

  pageContainers.css('display', 'none');

  if (container.length !== 0) {
    container.css('display', '');
    done && done();
    return;
  }

  pageContainers.css('display', 'none');
  $('.quasar-pages').append(newPage);

  quasar.page[context.identification].vm = new Vue(injectVue(vue, el + '> .quasar-page', done));
};
