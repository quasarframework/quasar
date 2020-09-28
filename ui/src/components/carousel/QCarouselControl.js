import { h, defineComponent } from 'vue'

import { slot } from '../../utils/slot.js'

export default defineComponent({
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
      default: () => [18, 18],
      validator: v => v.length === 2
    }
  },

  computed: {
    classes () {
      return `q-carousel__control absolute absolute-${this.position}`
    },

    style () {
      return {
        margin: `${this.offset[1]}px ${this.offset[0]}px`
      }
    }
  },

  render () {
    return h('div', {
      class: this.classes,
      style: this.style
    }, slot(this, 'default'))
  }
})
