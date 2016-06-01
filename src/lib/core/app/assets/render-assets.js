'use strict';

function injectVue(vue, el, readyFunction, layout) {
  vue.el = el;
  vue.replace = false;

  var handler = function() {
    quasar.nextTick(function() {
      readyFunction();
    });
  };

  if (!vue.ready) {
    vue.ready = handler;
    vue.___quasarInjected = $.noop;
    return vue; // <<< EARLY EXIT
  }

  var originalReadyFunction = vue.___quasarInjected || vue.ready;

  vue.ready = function() {
    originalReadyFunction.call(this);
    handler();
  };

  vue.___quasarInjected = originalReadyFunction;

  return vue;
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
  if (quasar.current.layout && quasar.current.layout.vm) {
    quasar.current.layout.vm.$destroy();
  }

  container.removeClass();

  if (!context.manifest.layout) {
    quasar.current.layout = null;
    container.html('');
    done && done();
    return;
  }

  container.addClass('layout-' + context.manifest.layout);
  quasar.current.layout = {name: context.manifest.layout};
  quasar.current.layout.vm = new Vue(injectVue(vue, el, done));
};

module.exports.page = function(vue, context, done) {
  var id = context.name;

  if (!context.manifest.layout) {
    $('#quasar-app').append('<div class="quasar-page page-' + id + '" style="overflow: auto; height: 100%;"></div>');
    quasar.current.page = quasar.page[id];
    quasar.page[id].vm = new Vue(injectVue(vue, '#quasar-app > .quasar-page', done));
    quasar.page[id].pageContainer = quasar.page[id].scrollContainer = $(quasar.page[id].vm.$el);
    done && done();
  }

  var
    el = '.page-' + id,
    container = $(el),
    sticky = $('.quasar-sticky-' + id),
    newPage = $(
      '<div class="quasar-page-container scroll page-' + id +
      '"><div class="quasar-page"></div></div>'
    );

  // page container elements
  $('.quasar-page-container').css('display', 'none');
  // page sticky elements
  $('.quasar-page-sticky').css('display', 'none');

  if (container.length !== 0) {
    container.css('display', '');
    sticky.css('display', '');
    quasar.current.page = quasar.page[id];
    done && done();
    return;
  }

  $('#quasar-app .quasar-pages').append(newPage);
  quasar.current.page = quasar.page[id];
  quasar.page[id].vm = new Vue(injectVue(vue, el + '> .quasar-page', done));
  quasar.page[id].pageContainer = $(quasar.page[id].vm.$el);
  quasar.page[id].scrollContainer = newPage;
};
