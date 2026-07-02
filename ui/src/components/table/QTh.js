import { getCurrentInstance, h } from 'vue'

import QIcon from '../icon/QIcon.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot, hUniqueSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/table
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QTh',

  props: {
    /**
     * QTable's header column scoped slot property
     *
     * @api prop props
     * @type {Object}
     * @category general
     * @example # :props="props"
     */
    props: Object,
    /**
     * Tries to shrink header column width size; Useful for columns with a checkbox/radio/toggle
     *
     * @api prop auto-width
     * @type {Boolean}
     * @category content
     */
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

      if (name) {
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

      return h('th', data, child)
    }
  }
})
