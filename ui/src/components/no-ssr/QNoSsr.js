import { h } from 'vue'

import useCanRender from '../../composables/private/use-can-render.js'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'

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
    const canRender = useCanRender()

    return () => {
      if (canRender.value === true) {
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
