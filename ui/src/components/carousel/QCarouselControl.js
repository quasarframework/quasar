import { computed, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/carousel
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QCarouselControl',

  props: {
    /**
     * Side/corner to stick to
     *
     * @api prop position
     * @type {String}
     * @default 'bottom-right'
     * @category position
     */
    position: {
      type: String,
      default: 'bottom-right',
      validator: v =>
        [
          'top-right',
          'top-left',
          'bottom-right',
          'bottom-left',
          'top',
          'right',
          'bottom',
          'left'
        ].includes(v)
    },
    /**
     * An array of two numbers to offset the component horizontally and vertically (in pixels)
     *
     * @api prop offset
     * @type {Array}
     * @default [18, 18]
     * @category position
     * @example [8, 8]
     * @example [5, 10]
     */
    offset: {
      type: Array,
      default: () => [18, 18],
      validator: v => v.length === 2
    }
  },

  setup(props, { slots }) {
    const classes = computed(
      () => `q-carousel__control absolute absolute-${props.position}`
    )
    const style = computed(() => ({
      margin: `${props.offset[1]}px ${props.offset[0]}px`
    }))

    return () =>
      h(
        'div',
        {
          class: classes.value,
          style: style.value
        },
        hSlot(slots.default)
      )
  }
})
