import Vue from 'vue'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTr',

  props: {
    props: Object,
    noHover: Boolean
  },

  render (h) {
    return h(
      'tr',
      {
        on: this.$listeners,
        class: (this.props === void 0 || this.props.header === true ? '' : this.props.__trClass) +
          (this.noHover === true ? ' q-tr--no-hover' : '')
      },
      slot(this, 'default')
    )
  }
})
