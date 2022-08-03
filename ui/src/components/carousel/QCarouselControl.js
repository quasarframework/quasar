import { h, computed } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'

export default createComponent({
  name: 'QCarouselControl',

  props: {
    position: {
      type: String,
      default: 'bottom-right',
      validator: v => [
        'top-right', 'top-left',
        'bottom-right', 'bottom-left',
        'top', 'right', 'bottom', 'left'
      ].includes(v)
    },
    offset: {
      type: Array,
      default: () => [ 18, 18 ],
      validator: v => v.length === 2
    }
  },

  setup (props, { slots }) {
    const classes = computed(() => `q-carousel__control absolute absolute-${ props.position }`)
    const style = computed(() => ({
      margin: `${ props.offset[ 1 ] }px ${ props.offset[ 0 ] }px`
    }))

    return () => h('div', {
      class: classes.value,
      style: style.value
    }, hSlot(slots.default))
  }
})
