import { h, defineComponent, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'

import { hSlot, hUniqueSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QTh',

  props: {
    props: Object,
    autoWidth: Boolean
  },

  emits: [ 'click' ],

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance()
    const { proxy: { $q } } = vm

    return () => {
      if (props.props === void 0) {
        return h('th', {
          class: props.autoWidth === true ? 'q-table--col-auto-width' : ''
        }, hSlot(slots.default))
      }

      let col, child
      const name = vm.vnode.key

      if (name) {
        col = props.props.colsMap[ name ]
        if (col === void 0) { return }
      }
      else {
        col = props.props.col
      }

      if (col.sortable === true) {
        const action = col.align === 'right'
          ? 'unshift'
          : 'push'

        child = hUniqueSlot(slots.default, [])
        child[ action ](
          h(QIcon, {
            class: col.__iconClass,
            name: $q.iconSet.table.arrowUp
          })
        )
      }
      else {
        child = hSlot(slots.default)
      }

      const data = {
        class: col.__thClass
          + (props.autoWidth === true ? ' q-table--col-auto-width' : ''),
        style: col.headerStyle
      }

      if (col.sortable === true) {
        data.onClick = evt => {
          props.props.sort(col) // eslint-disable-line
          emit('click', evt)
        }
      }

      return h('th', data, child)
    }
  }
})
