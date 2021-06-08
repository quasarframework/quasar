import { h, defineComponent, computed } from 'vue'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QCardSection',

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    horizontal: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-card__section'
      + ` q-card__section--${ props.horizontal === true ? 'horiz row no-wrap' : 'vert' }`
    )

    return () => h(props.tag, { class: classes.value }, hSlot(slots.default))
  }
})
