import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QCarouselControl',

  mixins: [ ListenersMixin ],

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
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
