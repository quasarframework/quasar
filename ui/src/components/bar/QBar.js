import { h, defineComponent, computed } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/use-dark.js'

import { hSlot } from '../../utils/composition-render.js'

export default defineComponent({
  name: 'QBar',

  props: {
    dense: Boolean,
    ...useDarkProps
  },

  setup (props, { slots }) {
    const $q = useQuasar()
    const { isDark } = useDark(props, $q)

    const classes = computed(() =>
      'q-bar row no-wrap items-center' +
      ` q-bar--${props.dense === true ? 'dense' : 'standard'} ` +
      ` q-bar--${isDark.value === true ? 'dark' : 'light'}`
    )

    return () => h('div', {
      class: classes.value,
      role: 'toolbar'
    }, hSlot(slots.default))
  }
})
