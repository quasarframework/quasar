import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTh',

  props: {
    props: Object,
    autoWidth: Boolean
  },

  render (h) {
    if (this.props === void 0) {
      return h('td', {
        class: this.autoWidth === true ? 'q-table--col-auto-width' : null
      }, slot(this, 'default'))
    }

    let col
    const
      name = this.$vnode.key,
      child = [].concat(slot(this, 'default'))

    if (name) {
      col = this.props.colsMap[name]
      if (col === void 0) { return }
    }
    else {
      col = this.props.col
    }

    if (col.sortable === true) {
      const action = col.align === 'right'
        ? 'unshift'
        : 'push'

      child[action](
        h(QIcon, {
          props: { name: this.$q.iconSet.table.arrowUp },
          staticClass: col.__iconClass
        })
      )
    }

    return h('th', {
      class: col.__thClass +
        (this.autoWidth === true ? ' q-table--col-auto-width' : ''),
      on: col.sortable === true
        ? { click: () => { this.props.sort(col) } }
        : null
    }, child)
  }
})
