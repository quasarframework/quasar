import { h, defineComponent, computed } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/use-dark.js'

import { hSlot } from '../../utils/composition-render.js'

export default defineComponent({
  name: 'QList',

  props: {
    ...useDarkProps,

    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    padding: Boolean
  },

  setup (props, { slots }) {
    const $q = useQuasar()
    const { isDark } = useDark(props, $q)

    const classes = computed(() =>
      'q-list' +
      (props.bordered === true ? ' q-list--bordered' : '') +
      (props.dense === true ? ' q-list--dense' : '') +
      (props.separator === true ? ' q-list--separator' : '') +
      (isDark.value === true ? ' q-list--dark' : '') +
      (props.padding === true ? ' q-list--padding' : '')
    )

    return () => h('div', { class: classes.value }, hSlot(slots.default))
  }
})
