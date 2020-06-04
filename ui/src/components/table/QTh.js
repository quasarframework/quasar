import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import ListenersMixin from '../../mixins/listeners.js'

import { slot, uniqueSlot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTh',

  mixins: [ ListenersMixin ],

  props: {
    props: Object,
    autoWidth: Boolean
  },

  render (h) {
    const on = { ...this.qListeners }

    if (this.props === void 0) {
      return h('th', {
        on,
        class: this.autoWidth === true ? 'q-table--col-auto-width' : null
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
          props: { name: this.$q.iconSet.table.arrowUp },
          staticClass: col.__iconClass
        })
      )
    }
    else {
      child = slot(this, 'default')
    }

    const evt = col.sortable === true
      ? {
        click: evt => {
          this.props.sort(col)
          this.$emit('click', evt)
        }
      }
      : {}

    return h('th', {
      on: { ...on, ...evt },
      style: col.headerStyle,
      class: col.__thClass +
        (this.autoWidth === true ? ' q-table--col-auto-width' : '')
    }, child)
  }
})
