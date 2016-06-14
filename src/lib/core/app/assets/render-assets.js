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

module.exports.layout = function(vue, context, oldLayout, done) {
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
  if (oldLayout && oldLayout.vm) {
    oldLayout.vm.$destroy();
  }

  container.removeClass();

  if (!quasar.current.layout) {
    container.html('');
    done && done();
    return;
  }

  container.addClass('layout-' + context.manifest.layout);
  quasar.current.layout.vm = new Vue(injectVue(vue, el, done));
};

module.exports.page = function(vue, context, done) {
  var
    id = context.name,
    root = $('#quasar-app')
    ;

  if (!context.manifest.layout) {
    root.append('<div class="quasar-page page-' + id + '" style="overflow: auto; height: 100%;"></div>');
    quasar.current.page.vm = new Vue(injectVue(vue, '#quasar-app > .quasar-page', done));
    quasar.current.page.pageContainer = quasar.current.page.scrollContainer = $(quasar.current.page.vm.$el);
    done && done();
  }
  else if (quasar.page.___quasarTemporary___) {
    quasar.page.___quasarTemporary___.vm.$destroy();
    root.find('.__quasar_temporary_page').remove();
    delete quasar.page.___quasarTemporary___;
  }

  var
    el = '.page-' + id + (context.parameterized ? '.__quasar_temporary_page' : ''),
    container = root.find(el),
    sticky = root.find('.quasar-sticky-' + id + (context.parameterized ? '.__quasar_temporary_sticky' : '')),
    newPage = $(
      '<div class="quasar-page-container scroll page-' +
      id + (context.parameterized ? ' __quasar_temporary_page' : '') +
      '"><div class="quasar-page"></div></div>'
    );

  root.find('.quasar-page-container, .quasar-page-sticky')
    .css('display', 'none');

  if (!context.parameterized && container.length !== 0) {
    container.css('display', '');
    sticky.css('display', '');
    quasar.current.page = quasar.page[id];
    done && done();
    return;
  }

  root.find('.quasar-pages').append(newPage);

  if (context.parameterized) {
    quasar.page.___quasarTemporary___ = quasar.current.page;
  }

  quasar.current.page.vm = new Vue(injectVue(vue, el + '> .quasar-page', done));
  quasar.current.page.pageContainer = $(quasar.current.page.vm.$el);
  quasar.current.page.scrollContainer = newPage;
};
