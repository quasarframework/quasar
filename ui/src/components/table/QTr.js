import { computed, h } from 'vue'

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
  name: 'QTr',

  props: {
    /**
     * QTable's row scoped slot property
     *
     * @api prop props
     * @type {Object}
     * @category general
     * @example # :props="props"
     */
    props: Object,
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
    const classes = computed(
      () =>
        'q-tr' +
        (props.props === void 0 || props.props.header
          ? ''
          : ' ' + props.props.__trClass) +
        (props.noHover ? ' q-tr--no-hover' : '')
    )

    return () =>
      h(
        'tr',
        {
          style: props.props?.__trStyle,
          class: classes.value
        },
        hSlot(slots.default)
      )
  }
})
