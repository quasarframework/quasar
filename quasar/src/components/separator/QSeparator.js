import Vue from 'vue'

export default Vue.extend({
  name: 'QSeparator',

  props: {
    dark: Boolean,
    spaced: Boolean,
    inset: [Boolean, String],
    vertical: Boolean,
    color: String
  },

  computed: {
    classes () {
      return {
        [`bg-${this.color}`]: this.color,
        'q-separator--dark': this.dark,
        'q-separator--spaced': this.spaced,
        'q-separator--inset': this.inset === true,
        'q-separator--item-inset': this.inset === 'item',
        'q-separator--item-thumbnail-inset': this.inset === 'item-thumbnail',
        [`q-separator--${this.vertical ? 'vertical self-stretch' : 'horizontal col-grow'}`]: true
      }
    }
  },

  render (h) {
    return h('hr', {
      staticClass: 'q-separator',
      class: this.classes
    })
  }
})
