import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QCard',

  mixins: [ DarkMixin ],

  props: {
    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },

  render (h) {
    return h('div', {
      staticClass: 'q-card',
      class: {
        'q-card--dark q-dark': this.isDark,
        'q-card--bordered': this.bordered,
        'q-card--square no-border-radius': this.square,
        'q-card--flat no-shadow': this.flat
      },
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
