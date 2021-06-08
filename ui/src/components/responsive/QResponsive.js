import { h, defineComponent } from 'vue'

import useRatio, { useRatioProps } from '../../composables/private/use-ratio.js'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
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
