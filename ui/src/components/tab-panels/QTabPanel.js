import { h, defineComponent } from 'vue'

import { PanelChildMixin } from '../../mixins/panel.js'
import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QTabPanel',

  mixins: [ PanelChildMixin ],

  render () {
    return h('div', { class: 'q-tab-panel' }, hSlot(this, 'default'))
  }
})
