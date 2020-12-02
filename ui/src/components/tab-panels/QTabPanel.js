import { h, defineComponent } from 'vue'

import { usePanelChildProps } from '../../composables/use-panel.js'
import { hSlot } from '../../utils/composition-render.js'

export default defineComponent({
  name: 'QTabPanel',

  props: usePanelChildProps,

  setup (_, { slots }) {
    return () => h('div', { class: 'q-tab-panel' }, hSlot(slots.default))
  }
})
