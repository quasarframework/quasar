import Vue from 'vue'

import { PanelParentMixin } from '../../mixins/panel.js'

export default Vue.extend({
  name: 'QTabPanels',

  mixins: [ PanelParentMixin ],

  methods: {
    __render (h) {
      return h('div', {
        staticClass: 'q-tab-panels q-panel-parent',
        directives: this.panelDirectives,
        on: this.$listeners
      }, this.__getPanelContent(h))
    }
  }
})
