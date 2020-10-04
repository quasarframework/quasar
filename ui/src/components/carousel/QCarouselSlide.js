import { h, defineComponent } from 'vue'

import { PanelChildMixin } from '../../mixins/panel.js'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QCarouselSlide',

  mixins: [ PanelChildMixin ],

  props: {
    imgSrc: String
  },

  computed: {
    style () {
      if (this.imgSrc) {
        return {
          backgroundImage: `url("${this.imgSrc}")`
        }
      }
    }
  },

  render () {
    return h('div', {
      class: 'q-carousel__slide',
      style: this.style
    }, hSlot(this, 'default'))
  }
})
