import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import { PanelParentMixin } from '../../mixins/panel.js'

export default Vue.extend({
  name: 'QTabPanels',

  mixins: [ DarkMixin, PanelParentMixin ],

  computed: {
    classes () {
      return 'q-tab-panels q-panel-parent' +
        (this.isDark === true ? ' q-tab-panels--dark q-dark' : '')
    }
  },

  methods: {
    __renderPanels (h) {
      return h('div', {
        class: this.classes,
        directives: this.panelDirectives,
        on: { ...this.qListeners }
      }, this.__getPanelContent(h))
    }
  }
})
