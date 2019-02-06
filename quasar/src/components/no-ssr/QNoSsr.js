import Vue from 'vue'

import CanRenderMixin from '../../mixins/can-render.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QNoSsr',

  mixins: [ CanRenderMixin ],

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    placeholder: String
  },

  render (h) {
    if (this.canRender === true) {
      const node = slot(this, 'default')
      return node === void 0
        ? node
        : (node.length > 1 ? h(this.tag, node) : node[0])
    }

    if (this.$scopedSlots.placeholder !== void 0) {
      const node = slot(this, 'placeholder')
      return node === void 0
        ? node
        : (
          node.length > 1
            ? h(this.tag, { staticClass: 'q-no-ssr-placeholder' }, node)
            : node[0]
        )
    }

    if (this.placeholder !== void 0) {
      return h(this.tag, { staticClass: 'q-no-ssr-placeholder' }, [
        this.placeholder
      ])
    }
  }
})
