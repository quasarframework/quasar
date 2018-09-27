import AlignMixin from '../../mixins/align.js'

import Vue from 'vue'
export default Vue.extend({
  name: 'QCardActions',

  mixins: [ AlignMixin ],

  props: {
    vertical: Boolean,
    align: { default: 'left' }
  },

  computed: {
    classes () {
      return `q-card__actions--${this.vertical ? 'vert column justify-start' : 'horiz row ' + this.alignClass}`
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-card__actions q-card__section',
      'class': this.classes
    }, this.$slots.default)
  }
})
