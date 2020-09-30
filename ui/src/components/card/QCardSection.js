import { h, defineComponent } from 'vue'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QCardSection',

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    horizontal: Boolean
  },

  computed: {
    classes () {
      return 'q-card__section' +
        ` q-card__section--${this.horizontal === true ? 'horiz row no-wrap' : 'vert'}`
    }
  },

  render () {
    return h(this.tag, { class: this.classes }, slot(this, 'default'))
  }
})
