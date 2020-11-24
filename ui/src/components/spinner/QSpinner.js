import { h, defineComponent } from 'vue'

import mixin from './spinner-mixin.js'

export default defineComponent({
  name: 'QSpinner',

  mixins: [mixin],

  props: {
    thickness: {
      type: Number,
      default: 5
    }
  },

  render () {
    return h('svg', {
      class: this.classes + ' q-spinner-mat',
      width: this.cSize,
      height: this.cSize,
      viewBox: '25 25 50 50'
    }, [
      h('circle', {
        class: 'path',
        cx: '50',
        cy: '50',
        r: '20',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': this.thickness,
        'stroke-miterlimit': '10'
      })
    ])
  }
})
