import { h, defineComponent } from 'vue'

import { PanelChildMixin } from '../../mixins/panel.js'
import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QTabPanel',

  mixins: [ PanelChildMixin ],

  render () {
    return h('div', {
      staticClass: 'q-tab-panel',
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
