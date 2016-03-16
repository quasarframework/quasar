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
    container = $(el),
    pageKeys = Object.keys(quasar.page)
    ;

  if (pageKeys.length > 0) {
    pageKeys.forEach(function(page) {
      var vm = quasar.page[page].vm;

      if (vm) {
        vm.$destroy();
      }
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
      '<div class="quasar-page-container scroll page-' + context.identification +
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
