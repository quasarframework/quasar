import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QToolbarTitle',

  props: {
    shrink: Boolean
  },

  render (h) {
    return h('div', {
      staticClass: 'q-toolbar__title ellipsis',
      class: this.shrink ? 'col-auto' : null,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
