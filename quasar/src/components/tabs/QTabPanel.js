import Vue from 'vue'

import { PanelChildMixin } from '../../mixins/panel.js'

export default Vue.extend({
  name: 'QTabPanel',

  mixins: [ PanelChildMixin ],

  render (h) {
    return h('div', {
      staticClass: 'q-tab-panel scroll',
      attrs: { role: 'tabpanel' }
    }, this.$slots.default)
  }
})
