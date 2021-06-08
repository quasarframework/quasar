import { h, defineComponent, computed } from 'vue'

import { usePanelChildProps } from '../../composables/private/use-panel.js'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QCarouselSlide',

  props: {
    ...usePanelChildProps,
    imgSrc: String
  },

  setup (props, { slots }) {
    const style = computed(() => (
      props.imgSrc
        ? { backgroundImage: `url("${ props.imgSrc }")` }
        : {}
    ))

    return () => h('div', {
      class: 'q-carousel__slide',
      style: style.value
    }, hSlot(slots.default))
  }
})
