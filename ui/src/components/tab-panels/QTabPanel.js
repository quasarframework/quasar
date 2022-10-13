import Vue from 'vue'

import { PanelChildMixin } from '../../mixins/panel.js'
import { slot } from '../../utils/private/slot.js'

const attrs = { role: 'tabpanel' }

export default Vue.extend({
  name: 'QTabPanel',

  mixins: [ PanelChildMixin ],

  render (h) {
    return h('div', {
      staticClass: 'q-tab-panel',
      attrs,
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
