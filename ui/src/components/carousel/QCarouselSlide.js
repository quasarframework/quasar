import { computed, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { usePanelChildProps } from '../../composables/private.use-panel/use-panel.js'

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
  name: 'QCarouselSlide',

  props: {
    ...usePanelChildProps,
    /**
     * URL pointing to a slide background image (use public folder)
     *
     * @api prop img-src
     * @type {String}
     * @category model
     * @example # (public folder) src="img/my-bg.png"
     * @example # (assets folder) src="~@/assets/my-img.png"
     * @example # (relative path format) :src="require('./my_img.jpg')"
     */
    imgSrc: String
  },

  setup(props, { slots }) {
    const style = computed(() =>
      props.imgSrc ? { backgroundImage: `url("${props.imgSrc}")` } : {}
    )

    return () =>
      h(
        'div',
        {
          class: 'q-carousel__slide',
          style: style.value
        },
        hSlot(slots.default)
      )
  }
})
