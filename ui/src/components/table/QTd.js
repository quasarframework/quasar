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

    let col = this.props.col
    const name = this.$vnode.key

    if (this.props.colsMap !== void 0 && name) {
      col = this.props.colsMap[name]
    }
    if (col === void 0) { return }

    return h('td', {
      class: col.__tdClass +
        (this.autoWidth === true ? ' q-table--col-auto-width' : '')
    }, slot(this, 'default'))
  }
})
