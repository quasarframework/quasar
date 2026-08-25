import { computed, getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QTd',

  props: {
    props: Object,
    colName: String,
    autoWidth: Boolean,
    noHover: Boolean
  },

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const classes = computed(
      () =>
        'q-td' +
        (props.autoWidth ? ' q-table--col-auto-width' : '') +
        (props.noHover ? ' q-td--no-hover' : '') +
        ' '
    )

    return () => {
      if (props.props === void 0) {
        return h('td', { class: classes.value }, hSlot(slots.default))
      }

      const name = props.colName !== void 0 ? props.colName : vm.vnode.key
      const col =
        (props.props.colsMap !== void 0 ? props.props.colsMap[name] : null) ||
        props.props.col

      if (col === void 0) return

      const { row } = props.props

      return h(
        'td',
        {
          class: classes.value + col.__tdClass(row),
          style: col.__tdStyle(row)
        },
        hSlot(slots.default)
      )
    }
  }
})
