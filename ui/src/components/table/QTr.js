import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'WTr',

  props: {
    props: Object
  },

  render (h) {
    return h(
      'tr',
      this.props === void 0 || this.props.header === true
        ? {}
        : { class: this.props.__trClass },
      slot(this, 'default')
    )
  }
})
