import { h, defineComponent, computed, provide } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { hSlot } from '../../utils/private/render.js'
import { timelineKey } from '../../utils/private/symbols.js'

export default defineComponent({
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
      validator: v => [ 'left', 'right' ].includes(v)
    },
    layout: {
      type: String,
      default: 'dense',
      validator: v => [ 'dense', 'comfortable', 'loose' ].includes(v)
    }
  },

  setup (props, { slots }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    provide(timelineKey, props)

    const classes = computed(() =>
      `q-timeline q-timeline--${ props.layout } q-timeline--${ props.layout }--${ props.side }`
      + (isDark.value === true ? ' q-timeline--dark' : '')
    )

    return () => h('ul', { class: classes.value }, hSlot(slots.default))
  }
})
