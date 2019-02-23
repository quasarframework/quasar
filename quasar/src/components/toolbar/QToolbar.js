import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QToolbar',

  props: {
    inset: Boolean
  },

  render (h) {
    return h('div', {
      staticClass: 'q-toolbar row no-wrap items-center relative-position',
      class: this.inset ? 'q-toolbar--inset' : null,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
