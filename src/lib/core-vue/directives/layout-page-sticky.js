'use strict';

var FragmentFactory = Vue.FragmentFactory;
var remove = Vue.util.remove;
var createAnchor = Vue.util.createAnchor;

Vue.directive('layout-page-sticky', {
  terminal: true,
  bind: function() {
    var container = document.getElementsByClassName('quasar-pages');

    if (container.length === 0) {
      throw new Error('Using v-layout-page-sticky on a page with no layout.');
    }

    this.anchor = createAnchor('v-layout-page-sticky');
    container[0].appendChild(this.anchor);
    remove(this.el);
    var factory = new FragmentFactory(this.vm, this.el);

    this.frag = factory.create(this._host, this._scope, this._frag);
    this.frag.before(this.anchor);
    this.frag.children[0].$el.className += ' quasar-page-sticky quasar-sticky-' + quasar.current.page.name;
  },
  unbind: function() {
    this.frag.remove();
    remove(this.anchor);
  }
});
