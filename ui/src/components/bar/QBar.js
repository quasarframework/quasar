import { h, defineComponent, computed } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QBar',

  props: {
    ...useDarkProps,
    dense: Boolean
  },

  setup (props, { slots }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    const classes = computed(() =>
      'q-bar row no-wrap items-center'
      + ` q-bar--${ props.dense === true ? 'dense' : 'standard' } `
      + ` q-bar--${ isDark.value === true ? 'dark' : 'light' }`
    )

    return () => h('div', {
      class: classes.value,
      role: 'toolbar'
    }, hSlot(slots.default))
  }
})
