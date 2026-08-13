import { computed, h } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
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

  setup(props, { slots }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    const classes = computed(
      () =>
        'q-card' +
        (isDark.value ? ' q-card--dark q-dark' : '') +
        (props.bordered ? ' q-card--bordered' : '') +
        (props.square ? ' q-card--square no-border-radius' : '') +
        (props.flat ? ' q-card--flat no-shadow' : '')
    )

    return () => h(props.tag, { class: classes.value }, hSlot(slots.default))
  }
})
