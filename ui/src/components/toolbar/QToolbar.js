import { h, computed } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default createComponent({
  name: 'QToolbar',

  props: {
    inset: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-toolbar row no-wrap items-center'
      + (props.inset === true ? ' q-toolbar--inset' : '')
    )

    return () => h('div', { class: classes.value, role: 'toolbar' }, hSlot(slots.default))
  }
})
