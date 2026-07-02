import { computed, getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

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
  name: 'QTd',

  props: {
    /**
     * QTable's column scoped slot property
     *
     * @api prop props
     * @type {Object}
     * @category general
     * @example # :props="props"
     */
    props: Object,
    /**
     * Tries to shrink column width size; Useful for columns with a checkbox/radio/toggle
     *
     * @api prop auto-width
     * @type {Boolean}
     * @category content
     */
    autoWidth: Boolean,
    /**
     * Disable hover effect
     *
     * @api prop no-hover
     * @type {Boolean}
     * @category style
     */
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

      const name = vm.vnode.key
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
