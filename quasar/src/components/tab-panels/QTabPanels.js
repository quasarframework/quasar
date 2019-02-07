import Vue from 'vue'

import { PanelParentMixin } from '../../mixins/panel.js'

export default Vue.extend({
  name: 'QTabPanels',

  mixins: [ PanelParentMixin ],

  methods: {
    __render (h) {
      return h('div', {
        staticClass: 'q-tab-panels relative-position',
        directives: this.panelDirectives
      }, this.__getPanelContent(h))
    }
  }
})
