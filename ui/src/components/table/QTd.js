import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTd',

  props: {
    props: Object,
    autoWidth: Boolean
  },

  render (h) {
    if (this.props === void 0) {
      return h('td', {
        class: { 'q-table--col-auto-width': this.autoWidth }
      }, slot(this, 'default'))
    }

    const name = this.$vnode.key

    const col = this.props.colsMap !== void 0 && name
      ? this.props.colsMap[name]
      : this.props.col

    if (col === void 0) { return }

    return h('td', {
      class: col.__tdClass +
        (this.autoWidth === true ? ' q-table--col-auto-width' : '')
    }, slot(this, 'default'))
  }
})
