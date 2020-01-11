import Vue from 'vue'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QCardSection',

  props: {
    horizontal: Boolean
  },

  computed: {
    classes () {
      return 'q-card__section ' +
        `q-card__section--${this.horizontal === true ? 'horiz row no-wrap' : 'vert'}`
    }
  },

  render (h) {
    return h('div', {
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
