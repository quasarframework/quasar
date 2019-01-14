import Vue from 'vue'

export default Vue.extend({
  name: 'QBadge',

  props: {
    color: String,
    textColor: String,

    floating: Boolean,
    align: {
      type: String,
      validator: v => ['top', 'middle', 'bottom'].includes(v)
    }
  },

  computed: {
    style () {
      if (this.align !== void 0) {
        return { verticalAlign: this.align }
      }
    },

    classes () {
      return 'q-badge' +
        (this.color ? ` bg-${this.color}` : '') +
        (this.textColor !== void 0 ? ` text-${this.textColor}` : '') +
        (this.floating === true ? ' q-badge--floating' : '')
    }
  },

  render (h) {
    return h('span', {
      style: this.style,
      class: this.classes
    }, this.$slots.default)
  }
})
