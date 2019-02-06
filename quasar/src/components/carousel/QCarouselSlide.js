import Vue from 'vue'

import { PanelChildMixin } from '../../mixins/panel.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QCarouselSlide',

  mixins: [ PanelChildMixin ],

  props: {
    imgSrc: String
  },

  computed: {
    style () {
      if (this.imgSrc) {
        return {
          backgroundImage: `url(${this.imgSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: '50%'
        }
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-carousel__slide relative-position scroll',
      style: this.style
    }, slot(this, 'default'))
  }
})
