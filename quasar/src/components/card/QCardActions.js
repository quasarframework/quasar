import Vue from 'vue'

import AlignMixin from '../../mixins/align.js'

export default Vue.extend({
  name: 'QCardActions',

  mixins: [ AlignMixin ],

  props: {
    vertical: Boolean
  },

  computed: {
    classes () {
      return `q-card__actions--${this.vertical ? 'vert column justify-start' : 'horiz row ' + this.alignClass}`
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-card__actions',
      class: this.classes
    }, this.$slots.default)
  }
})
