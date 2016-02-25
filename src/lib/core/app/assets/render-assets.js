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

function destroyTemporaryPages() {
  var destroyElement;

  Object.keys(quasar.page).forEach(function(page) {
    if (page.indexOf('--') > 0) {
      destroyElement = $(quasar.page[page].vm.$el).parent();
      quasar.page[page].vm.$destroy();
      destroyElement.remove();
    }
  });
}

module.exports.layout = function(vue, context, done) {
  var
    el = '#quasar-app',
    container = $(el)
    ;

  if (quasar.page.length > 0) {
    Object.keys(quasar.page).forEach(function(page) {
      quasar.page[page].vm.$destroy();
    });
  }
  if (quasar.layout.vm) {
    quasar.layout.vm.$destroy();
  }

  container.removeClass();

  if (!context.manifest.layout) {
    delete quasar.layout.vm;
    container.html('');
    done && done();
    return;
  }

  container.addClass('layout-' + context.manifest.layout);
  injectNavigation(vue);

  quasar.layout.vm = new Vue(injectVue(vue, el, done));
};

module.exports.page = function(vue, context, done) {
  destroyTemporaryPages();

  if (!context.manifest.layout) {
    $('#quasar-app').append('<div class="quasar-page page-' + context.identification + '"></div>');
    quasar.page[context.identification].vm = new Vue(injectVue(vue, '#quasar-app > .quasar-page', done));
    done && done();
  }

  var
    el = '.page-' + context.identification,
    container = $(el),
    pageContainers = $('.quasar-page-container'),
    newPage = $(
      '<div class="quasar-page-container page-' + context.identification +
      '"><div class="quasar-page"></div></div>'
    );

  pageContainers.css('display', 'none');

  if (container.length !== 0) {
    container.css('display', '');
    done && done();
    return;
  }

  pageContainers.css('display', 'none');
  $('#quasar-app .quasar-pages').append(newPage);

  quasar.page[context.identification].vm = new Vue(injectVue(vue, el + '> .quasar-page', done));
};
