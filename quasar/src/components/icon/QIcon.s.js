import Vue from 'vue'

export default Vue.extend({
  name: 'QIcon',

  props: {
    name: String,
    color: String,
    size: String,
    left: Boolean,
    right: Boolean
  },

  computed: {
    type () {
      const icon = this.name

      return {
        cls: 'ic ic-' + icon + (this.color !== void 0 ? ` text-${this.color}` : '') +
          (this.left === true ? ' on-left' : '') +
          (this.right === true ? ' on-right' : '')
      }
    },

    style () {
      if (this.size) {
        return { fontSize: this.size }
      }
    }
  },

  render (h) {
    return h('i', {
      class: this.type.cls,
      style: this.style,
      on: this.$listeners
    })
  }
})
