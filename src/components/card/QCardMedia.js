import Vue from 'vue'
export default Vue.extend({
  name: 'QCardMedia',

  props: {
    overlayPosition: {
      type: String,
      default: 'bottom',
      validator: v => ['top', 'bottom', 'full'].includes(v)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-card__media relative-position',
      'class': `q-card__media--${this.overlayPosition}`
    }, this.$slots.default)
  }
})
