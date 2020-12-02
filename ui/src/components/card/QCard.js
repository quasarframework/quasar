import { h, defineComponent, computed } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/use-dark.js'

import { hSlot } from '../../utils/composition-render.js'

export default defineComponent({
  name: 'QCard',

  props: {
    ...useDarkProps,

    tag: {
      type: String,
      default: 'div'
    },

    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },

  setup (props, { slots }) {
    const $q = useQuasar()
    const { isDark } = useDark(props, $q)

    const classes = computed(() =>
      'q-card' +
      (isDark.value === true ? ' q-card--dark q-dark' : '') +
      (props.bordered === true ? ' q-card--bordered' : '') +
      (props.square === true ? ' q-card--square no-border-radius' : '') +
      (props.flat === true ? ' q-card--flat no-shadow' : '')
    )

    return () => h(props.tag, { class: classes.value }, hSlot(slots.default))
  }
})
