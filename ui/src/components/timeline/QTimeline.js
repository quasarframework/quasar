import { computed, h, provide } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import { timelineKey } from '../../utils/private.symbols/symbols.js'

const sideValues = ['left', 'right']
const layoutValues = ['dense', 'comfortable', 'loose']

export default /*#__PURE__*/ createComponent({
  name: 'QTimeline',

  props: {
    ...useDarkProps,

    color: {
      type: String,
      default: 'primary'
    },
    side: {
      type: String,
      default: 'right',
      validator: v => sideValues.includes(v)
    },
    layout: {
      type: String,
      default: 'dense',
      validator: v => layoutValues.includes(v)
    }
  },

  setup(props, { slots }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    provide(timelineKey, props)

    const classes = computed(
      () =>
        `q-timeline q-timeline--${props.layout} q-timeline--${props.layout}--${props.side}` +
        (isDark() ? ' q-timeline--dark' : '')
    )

    return () => h('ul', { class: classes.value }, hSlot(slots.default))
  }
})
