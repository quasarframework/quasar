import { h } from 'vue'

import useHydration from '../../composables/use-hydration/use-hydration.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/no-ssr
 */
/**
 * Default slot is used to render content on client-side
 *
 * @api slot default
 */

/**
 * Slot used as placeholder on server-side render, which gets replaced by the default slot on client-side; overrides 'placeholder' prop
 *
 * @api slot placeholder
 */
export default createComponent({
  name: 'QNoSsr',

  props: {
    /**
     * HTML tag to use when wrapping multiple nodes
     *
     * @api prop tag
     * @extends tag
     * @default 'div'
     * @example 'div'
     * @example 'span'
     * @example 'blockquote'
     */
    tag: {
      type: String,
      default: 'div'
    },

    /**
     * Text to display on server-side render (unless using 'placeholder' slot)
     *
     * @api prop placeholder
     * @type {String}
     * @category content
     * @example 'This is server-side only'
     */
    placeholder: String
  },

  setup(props, { slots }) {
    const { isHydrated } = useHydration()

    return () => {
      if (isHydrated.value) {
        const node = hSlot(slots.default)
        return node === void 0
          ? node
          : node.length > 1
            ? h(props.tag, {}, node)
            : node[0]
      }

      const data = {
        class: 'q-no-ssr-placeholder'
      }

      const node = hSlot(slots.placeholder)
      if (node !== void 0) {
        return node.length > 1 ? h(props.tag, data, node) : node[0]
      }

      if (props.placeholder !== void 0) {
        return h(props.tag, data, props.placeholder)
      }
    }
  }
})
