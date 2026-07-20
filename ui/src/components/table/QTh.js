import { getCurrentInstance, h } from 'vue'

import QIcon from '../icon/QIcon.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot, hUniqueSlot } from '../../utils/private.render/render.js'

export default createComponent({
  name: 'QTh',

  props: {
    props: Object,
    autoWidth: Boolean
  },

  emits: ['click'],

  setup(props, { slots, emit }) {
    const vm = getCurrentInstance()
    const {
      proxy: { $q }
    } = vm

    const onClick = evt => {
      emit('click', evt)
    }

    const onKeyup = (evt, col) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        props.props.sort(col)
        onClick(evt)
        evt.preventDefault()
      }
    }

    return () => {
      if (props.props === void 0) {
        return h(
          'th',
          {
            class: props.autoWidth ? 'q-table--col-auto-width' : '',
            onClick
          },
          hSlot(slots.default)
        )
      }

      let col, child
      const name = vm.vnode.key

      if (name !== null) {
        col = props.props.colsMap[name]
        if (col === void 0) return
      } else {
        col = props.props.col
      }

      if (col.sortable) {
        const action = col.align === 'right' ? 'unshift' : 'push'

        child = hUniqueSlot(slots.default, [])
        child[action](
          h(QIcon, {
            class: col.__iconClass,
            name: $q.iconSet.table.arrowUp
          })
        )
      } else {
        child = hSlot(slots.default)
      }

      const data = {
        class:
          col.__thClass + (props.autoWidth ? ' q-table--col-auto-width' : ''),
        style: col.headerStyle,
        onClick: evt => {
          if (col.sortable) props.props.sort(col)
          onClick(evt)
        }
      }

      if (col.sortable) {
        data.tabindex = 0
        data['aria-sort'] = col.__ariaSort
        data.onKeydown = evt => {
          if (evt.key === ' ') evt.preventDefault()
        }
        data.onKeyup = evt => {
          onKeyup(evt, col)
        }
      }

      return h('th', data, child)
    }
  }
})
