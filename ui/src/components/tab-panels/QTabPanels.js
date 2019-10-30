import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import { PanelParentMixin } from '../../mixins/panel.js'

export default Vue.extend({
  name: 'QTabPanels',

  mixins: [ DarkMixin, PanelParentMixin ],

  methods: {
    __renderPanels (h) {
      return h('div', {
        staticClass: 'q-tab-panels q-panel-parent',
        class: this.isDark === true ? 'q-tab-panels--dark q-dark' : '',
        directives: this.panelDirectives,
        on: this.$listeners
      }, this.__getPanelContent(h))
    }
  }
})
