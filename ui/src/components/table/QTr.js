import Vue from 'vue'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTr',

  props: {
    props: Object,
    noHover: Boolean
  },

  render (h) {
    const on = this.$listeners

    return h(
      'tr',
      this.props === void 0 || this.props.header === true
        ? on
        : {
          on,
          class: this.props.__trClass +
            (this.noHover === true ? ' q-tr--no-hover' : '')
        },
      slot(this, 'default')
    )
  }
})
