import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QList',

  props: {
    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    dark: Boolean,
    padding: Boolean
  },

  computed: {
    classes () {
      return 'q-list' +
        (this.bordered === true ? ' q-list--bordered' : '') +
        (this.dense === true ? ' q-list--dense' : '') +
        (this.separator === true ? ' q-list--separator' : '') +
        (this.dark === true ? ' q-list--dark' : '') +
        (this.padding === true ? ' q-list--padding' : '')
    }
  },

  render (h) {
    return h('div', {
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
