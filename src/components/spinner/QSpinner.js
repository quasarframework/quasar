import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinner',

  mixins: [ mixin ],

  props: {
    thickness: {
      type: Number,
      default: 5
    }
  },

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner q-spinner-mat',
      class: this.classes,
      attrs: {
        'width': this.size,
        'height': this.size,
        'viewBox': '25 25 50 50'
      }
    }, [
      h('circle', {
        staticClass: 'path',
        attrs: {
          'cx': '50',
          'cy': '50',
          'r': '20',
          'fill': 'none',
          'stroke': 'currentColor',
          'stroke-width': this.thickness,
          'stroke-miterlimit': '10'
        }
      })
    ])
  }
})
