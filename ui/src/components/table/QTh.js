import { h, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot, hUniqueSlot } from '../../utils/private.render/render.js'

export default createComponent({
  name: 'QTh',

  props: {
    props: Object,
    autoWidth: Boolean,
    resizableColumns: Boolean,
    resizing: String
  },

  emits: [ 'click', 'startResize', 'autoResize' ],

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance()
    const { proxy: { $q } } = vm

    const onClick = evt => { emit('click', evt) }

    return () => {
      if (props.props === void 0) {
        return h('th', {
          class: props.autoWidth === true ? 'q-table--col-auto-width' : '',
          onClick
        }, hSlot(slots.default))
      }

      let col, child
      const name = vm.vnode.key

      if (name) {
        col = props.props.colsMap[ name ]
        if (col === void 0) return
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
          + (props.autoWidth === true ? ' q-table--col-auto-width' : '')
          + (props.resizing === col.name ? ' is-resizing' : ''),
        style: col.headerStyle,
        onClick: evt => {
          col.sortable === true && props.props.sort(col)
          onClick(evt)
        }
      }

      if (props.resizableColumns === true) {
        const resizeHandle = h('div', {
          class: 'q-table__column-resizer' + (props.resizing === col.name ? ' is-resizing' : ''),
          onMousedown: evt => {
            emit('startResize', evt, col)
          },
          onDblclick: evt => {
            evt.stopPropagation()
            emit('autoResize', col)
          }
        })

        const children = Array.isArray(child) ? child : [ child ]
        return h('th', data, [ ...children, resizeHandle ])
      }

      return h('th', data, child)
    }
  }
})
