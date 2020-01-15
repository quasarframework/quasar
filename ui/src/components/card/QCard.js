import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import RatioMixin from '../../mixins/ratio.js'
import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QCard',

  mixins: [ DarkMixin, RatioMixin ],

  props: {
    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },

  computed: {
    classes () {
      return 'q-card' +
        (this.isDark === true ? ' q-card--dark q-dark' : '') +
        (this.bordered === true ? ' q-card--bordered' : '') +
        (this.square === true ? ' q-card--square no-border-radius' : '') +
        (this.flat === true ? ' q-card--flat no-shadow' : '')
    }
  },

  render (h) {
    return h('div', {
      class: this.classes,
      style: this.ratioStyle,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
