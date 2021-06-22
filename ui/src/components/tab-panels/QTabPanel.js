import { h, defineComponent } from 'vue'

import { usePanelChildProps } from '../../composables/private/use-panel.js'
import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QTabPanel',

  props: usePanelChildProps,

  setup (_, { slots }) {
    return () => h('div', { class: 'q-tab-panel' }, hSlot(slots.default))
  }
})
