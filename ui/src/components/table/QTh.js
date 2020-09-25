import { h, defineComponent } from 'vue'

import QIcon from '../icon/QIcon.js'

import { slot, uniqueSlot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QTh',

  props: {
    props: Object,
    autoWidth: Boolean
  },

  render () {
    if (this.props === void 0) {
      return h('th', {
        class: this.autoWidth === true ? 'q-table--col-auto-width' : ''
      }, slot(this, 'default'))
    }

    let col, child
    const name = this.$vnode.key

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

      child = uniqueSlot(this, 'default', [])
      child[action](
        h(QIcon, {
          class: col.__iconClass,
          name: this.$q.iconSet.table.arrowUp
        })
      )
    }
    else {
      child = slot(this, 'default')
    }

    const data = {
      class: col.__thClass +
        (this.autoWidth === true ? ' q-table--col-auto-width' : ''),
      style: col.headerStyle
    }

    if (col.sortable === true) {
      data.onClick = evt => {
        this.props.sort(col)
        this.$emit('click', evt)
      }
    }

    return h('th', data, child)
  }
})
