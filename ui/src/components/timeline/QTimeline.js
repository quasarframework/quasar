import { h, computed, provide, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import { timelineKey } from '../../utils/private.symbols/symbols.js'

export default createComponent({
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
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    provide(timelineKey, props)

    const classes = computed(() =>
      `q-timeline q-timeline--${ props.layout } q-timeline--${ props.layout }--${ props.side }`
      + (isDark.value === true ? ' q-timeline--dark' : '')
    )

    return () => h('ul', { class: classes.value }, hSlot(slots.default))
  }
})
