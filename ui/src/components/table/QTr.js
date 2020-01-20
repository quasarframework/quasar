import Vue from 'vue'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTr',

  props: {
    props: Object,
    noHover: Boolean
  },

  computed: {
    classes () {
      return 'q-tr' + (this.props === void 0 || this.props.header === true ? '' : ' ' + this.props.__trClass) +
        (this.noHover === true ? ' q-tr--no-hover' : '')
    }
  },

  render (h) {
    return h('tr', {
      on: this.$listeners,
      staticClass: this.classes,
      class: this.$listeners.click !== void 0 ? 'cursor-pointer' : ''
    }, slot(this, 'default'))
  }
})
