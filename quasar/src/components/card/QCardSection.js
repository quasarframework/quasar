import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QCardSection',

  render (h) {
    return h('div', {
      staticClass: 'q-card__section relative-position',
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
