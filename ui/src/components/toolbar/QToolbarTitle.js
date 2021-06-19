import { h, defineComponent, computed } from 'vue'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QToolbarTitle',

  props: {
    shrink: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-toolbar__title ellipsis'
      + (props.shrink === true ? ' col-shrink' : '')
    )

    return () => h('div', { class: classes.value }, hSlot(slots.default))
  }
})
