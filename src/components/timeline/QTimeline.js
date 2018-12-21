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
    responsive: Boolean,
    dark: Boolean
  },

  computed: {
    classes () {
      return {
        'q-timeline--dark': this.dark,
        'q-timeline--responsive': this.responsive
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
