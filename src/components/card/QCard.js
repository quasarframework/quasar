import Vue from 'vue'
export default Vue.extend({
  name: 'QCard',

  props: {
    square: Boolean,
    dark: Boolean,
    flat: Boolean,
    bordered: Boolean,
    inline: Boolean
  },

  computed: {
    classes () {
      return {
        'q-card--dark': this.dark,
        'q-card--bordered': this.bordered,
        'q-card--square no-border-radius': this.square,
        'q-card--flat no-shadow': this.flat,
        'inline-block': this.inline
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-card generic-border-radius',
      'class': this.classes
    }, this.$slots.default)
  }
})
