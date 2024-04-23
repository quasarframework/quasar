import { h } from 'vue'

import useRatio, { useRatioProps } from '../../composables/private.use-ratio/use-ratio.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default createComponent({
  name: 'QResponsive',

  props: useRatioProps,

  setup (props, { slots }) {
    const ratioStyle = useRatio(props)

    return () => h('div', {
      class: 'q-responsive'
    }, [
      h('div', {
        class: 'q-responsive__filler overflow-hidden'
      }, [
        h('div', { style: ratioStyle.value })
      ]),

      h('div', {
        class: 'q-responsive__content absolute-full fit'
      }, hSlot(slots.default))
    ])
  }
})
