import Vue from 'vue'

import CanRenderMixin from '../../mixins/can-render.js'
import TagMixin from '../../mixins/tag.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QNoSsr',

  mixins: [ CanRenderMixin, TagMixin ],

  props: {
    placeholder: String
  },

  render (h) {
    const data = {
      on: this.$listeners
    }

    if (this.canRender === true) {
      const node = slot(this, 'default')
      return node === void 0
        ? node
        : (node.length > 1 ? h(this.tag, data, node) : node[0])
    }

    data.staticClass = 'q-no-ssr-placeholder'

    const node = slot(this, 'placeholder')
    if (node !== void 0) {
      return node.length > 1
        ? h(this.tag, data, node)
        : node[0]
    }

    if (this.placeholder !== void 0) {
      return h(this.tag, data, [
        this.placeholder
      ])
    }
  }
})
