import { h } from 'vue'

import useHydration from '../../composables/use-hydration/use-hydration.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default createComponent({
  name: 'QNoSsr',

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    placeholder: String
  },

  setup (props, { slots }) {
    const { isHydrated } = useHydration()

    return () => {
      if (isHydrated.value === true) {
        const node = hSlot(slots.default)
        return node === void 0
          ? node
          : (node.length > 1 ? h(props.tag, {}, node) : node[ 0 ])
      }

      const data = {
        class: 'q-no-ssr-placeholder'
      }

      const node = hSlot(slots.placeholder)
      if (node !== void 0) {
        return node.length > 1
          ? h(props.tag, data, node)
          : node[ 0 ]
      }

      if (props.placeholder !== void 0) {
        return h(props.tag, data, props.placeholder)
      }
    }
  }
})
