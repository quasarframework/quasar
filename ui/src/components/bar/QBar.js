import { computed, getCurrentInstance, h } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QBar',

  props: {
    ...useDarkProps,
    dense: Boolean
  },

  setup(props, { slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const isDark = useDark(props, $q)

    const classes = computed(
      () =>
        'q-bar row no-wrap items-center' +
        ` q-bar--${props.dense ? 'dense' : 'standard'} ` +
        ` q-bar--${isDark.value ? 'dark' : 'light'}`
    )

    return () =>
      h(
        'div',
        {
          class: classes.value,
          role: 'toolbar'
        },
        hSlot(slots.default)
      )
  }
})
