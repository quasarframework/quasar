import { h, computed } from 'vue'

import useAlign, { useAlignProps } from '../../composables/private.use-align/use-align.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default createComponent({
  name: 'QCardActions',

  props: {
    ...useAlignProps,
    vertical: Boolean
  },

  setup (props, { slots }) {
    const alignClass = useAlign(props)

    const classes = computed(() =>
      `q-card__actions ${ alignClass.value }`
      + ` q-card__actions--${ props.vertical === true ? 'vert column' : 'horiz row' }`
    )

    return () => h('div', { class: classes.value }, hSlot(slots.default))
  }
})
