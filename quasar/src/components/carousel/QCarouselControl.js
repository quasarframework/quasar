import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QCarouselControl',

  props: {
    position: {
      type: String,
      default: 'bottom-right'
    },
    offset: {
      type: Array,
      default: () => [18, 18]
    }
  },

  computed: {
    classes () {
      return `absolute-${this.position}`
    },
    style () {
      return {
        margin: `${this.offset[1]}px ${this.offset[0]}px`
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-carousel__control absolute',
      style: this.style,
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
