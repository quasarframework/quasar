import { h } from 'vue'

import { usePanelChildProps } from '../../composables/private/use-panel.js'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'

export default createComponent({
  name: 'QTabPanel',

  props: usePanelChildProps,

  setup (_, { slots }) {
    return () => h('div', { class: 'q-tab-panel' }, hSlot(slots.default))
  }
})
