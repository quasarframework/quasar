import Vue from 'vue'

import { PanelChildMixin } from '../../mixins/panel.js'

export default Vue.extend({
  name: 'QTabPane',

  mixins: [ PanelChildMixin ],

  render (h) {
    return h('div', {
      staticClass: 'q-tab-pane',
      attrs: { role: 'tabpanel' }
    }, this.$slots.default)
  }
})
