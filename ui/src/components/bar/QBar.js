import { h, computed, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'

export default createComponent({
  name: 'QBar',

  props: {
    ...useDarkProps,
    dense: Boolean
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

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
