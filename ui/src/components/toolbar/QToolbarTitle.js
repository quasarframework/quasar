import Vue from 'vue'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QToolbarTitle',

  props: {
    shrink: Boolean,
    align: String
  },

  computed: {
    style () {
      return Object.assign(
        {
          'text-align': this.align
        }
      )
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-toolbar__title ellipsis',
      class: this.shrink === true ? 'col-shrink' : null,
      style: this.style,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
