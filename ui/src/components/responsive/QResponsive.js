import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useResponsive, { useResponsiveProps } from './use-responsive.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/responsive
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QResponsive',

  props: useResponsiveProps,

  setup(props, { slots }) {
    const responsive = useResponsive(props)

    return () =>
      h(
        'div',
        {
          class: 'q-responsive'
        },
        [
          h(
            'div',
            {
              class: 'q-responsive__filler overflow-hidden'
            },
            [h('div', { style: responsive.ratioStyle.value })]
          ),

          h(
            'div',
            {
              class: 'q-responsive__content absolute-full fit'
            },
            hSlot(slots.default)
          )
        ]
      )
  }
})
