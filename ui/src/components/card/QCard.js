import { h, defineComponent, computed, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { hSlot } from '../../utils/private/render.js'

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
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const classes = computed(() =>
      'q-card'
      + (isDark.value === true ? ' q-card--dark q-dark' : '')
      + (props.bordered === true ? ' q-card--bordered' : '')
      + (props.square === true ? ' q-card--square no-border-radius' : '')
      + (props.flat === true ? ' q-card--flat no-shadow' : '')
    )

    return () => h(props.tag, { class: classes.value }, hSlot(slots.default))
  }
})
