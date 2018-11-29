import Vue from 'vue'

export default Vue.extend({
  name: 'QCard',

  props: {
    dark: Boolean,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,
    inline: Boolean
  },

  render (h) {
    return h('div', {
      staticClass: 'q-card',
      class: {
        'q-card--dark': this.dark,
        'q-card--bordered': this.bordered,
        'q-card--square no-border-radius': this.square,
        'q-card--flat no-shadow': this.flat,
        'inline-block': this.inline
      }
    }, this.$slots.default)
  }
})
