'use strict';

var templates = $(require('raw!./tree.html'));

Vue.component('tree-item', {
  template: templates.find('#tree-item').html(),
  props: ['model', 'contract-html', 'expand-html'],
  methods: {
    toggle: function() {
      if (this.isExpandable) {
        this.model.expanded = !this.model.expanded;
        return;
      }

      if (typeof this.model.handler === 'function') {
        this.model.handler(this.model);
      }
    }
  },
  computed: {
    isExpandable: function() {
      return this.model.children && this.model.children.length;
    }
  }
});

Vue.component('tree', {
  template: templates.find('#tree').html(),
  props: {
    model: {
      type: Array,
      required: true
    },
    contractHtml: {
      type: String,
      required: true
    },
    expandHtml: {
      type: String,
      required: true
    }
  }
});
