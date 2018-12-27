import Vue from 'vue'

import CanRenderMixin from '../../mixins/can-render.js'

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
    if (this.canRender) {
      const slot = this.$slots.default
      return slot !== void 0 && slot.length > 1
        ? h(this.tag, slot)
        : (slot ? slot[0] : null)
    }

    if (this.$slots.placeholder) {
      const slot = this.$slots.placeholder
      return slot !== void 0 && slot.length > 1
        ? h(this.tag, { staticClass: 'q-no-ssr-placeholder' }, slot)
        : (slot ? slot[0] : null)
    }

    if (this.placeholder) {
      return h(this.tag, { staticClass: 'q-no-ssr-placeholder' }, [
        this.placeholder
      ])
    }
  }
})
