import Vue from 'vue'

export default Vue.extend({
  name: 'QTimeline',

  provide () {
    return {
      __timeline: this
    }
  },

  props: {
    color: {
      type: String,
      default: 'primary'
    },
    side: {
      type: String,
      default: 'right',
      validator: v => ['left', 'right'].includes(v)
    },
    layout: {
      type: String,
      default: 'dense',
      validator: v => ['dense', 'comfortable', 'loose'].includes(v)
    },
    dark: Boolean
  },

  computed: {
    classes () {
      return {
        'q-timeline--dark': this.dark,
        [`q-timeline--${this.layout}`]: true,
        [`q-timeline--${this.layout}--${this.side}`]: true
      }
    }
  },

  render (h) {
    return h('ul', {
      staticClass: 'q-timeline',
      class: this.classes
    }, this.$slots.default)
  }
})
