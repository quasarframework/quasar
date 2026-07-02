import { computed, getCurrentInstance, h, provide } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import { timelineKey } from '../../utils/private.symbols/symbols.js'

const sideValues = ['left', 'right']
const layoutValues = ['dense', 'comfortable', 'loose']

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/timeline
 */
/**
 * Used for content of component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QTimeline',

  props: {
    ...useDarkProps,

    /**
     * @api prop color
     * @extends color
     * @default 'primary'
     */
    color: {
      type: String,
      default: 'primary'
    },
    /**
     * Side to place the timeline entries in dense and comfortable layout; For loose layout it gets overridden by QTimelineEntry side prop
     *
     * @api prop side
     * @type {String}
     * @default 'right'
     * @category behavior
     */
    side: {
      type: String,
      default: 'right',
      validator: v => sideValues.includes(v)
    },
    /**
     * Layout of the timeline. Dense keeps content and labels on one side. Comfortable keeps content on one side and labels on the opposite side. Loose puts content on both sides.
     *
     * @api prop layout
     * @type {String}
     * @default 'dense'
     * @category behavior
     */
    layout: {
      type: String,
      default: 'dense',
      validator: v => layoutValues.includes(v)
    }
  },

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    provide(timelineKey, props)

    const classes = computed(
      () =>
        `q-timeline q-timeline--${props.layout} q-timeline--${props.layout}--${props.side}` +
        (isDark.value ? ' q-timeline--dark' : '')
    )

    return () => h('ul', { class: classes.value }, hSlot(slots.default))
  }
})
