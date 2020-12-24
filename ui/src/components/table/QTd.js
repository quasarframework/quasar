import { h, defineComponent, computed, getCurrentInstance } from 'vue'

import { hSlot } from '../../utils/composition-render.js'

export default defineComponent({
  name: 'QTd',

  props: {
    props: Object,
    autoWidth: Boolean,
    noHover: Boolean
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance()
    const classes = computed(() =>
      'q-td' + (props.autoWidth === true ? ' q-table--col-auto-width' : '') +
      (props.noHover === true ? ' q-td--no-hover' : '')
    )

    return () => {
      if (props.props === void 0) {
        return h('td', { class: classes.value }, hSlot(slots.default))
      }

      const name = vm.vnode.key

      const col = props.props.colsMap !== void 0 && name
        ? props.props.colsMap[ name ]
        : props.props.col

      if (col === void 0) { return }

      return h('td', {
        class: classes.value + ' ' + col.__tdClass,
        style: col.style
      }, hSlot(slots.default))
    }
  }
})
