import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QBar',

  mixins: [ DarkMixin ],

  props: {
    dense: Boolean
  },

  computed: {
    classes () {
      return `q-bar--${this.dense === true ? 'dense' : 'standard'} ` +
        `q-bar--${this.isDark === true ? 'dark' : 'light'}`
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-bar row no-wrap items-center',
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
