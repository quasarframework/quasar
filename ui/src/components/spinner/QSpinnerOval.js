import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerOval',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      on: this.$listeners,
      attrs: {
        'stroke': 'currentColor',
        'width': this.size,
        'height': this.size,
        'viewBox': '0 0 38 38',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('g', {
        attrs: {
          'transform': 'translate(1 1)',
          'stroke-width': '2',
          'fill': 'none',
          'fill-rule': 'evenodd'
        }
      }, [
        h('circle', {
          attrs: {
            'stroke-opacity': '.5',
            'cx': '18',
            'cy': '18',
            'r': '18'
          }
        }),
        h('path', {
          attrs: {
            'd': 'M36 18c0-9.94-8.06-18-18-18'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'rotate',
              'from': '0 18 18',
              'to': '360 18 18',
              'dur': '1s',
              'repeatCount': 'indefinite'
            }
          })
        ])
      ])
    ])
  }
})
