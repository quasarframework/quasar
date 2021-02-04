import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerOrbit',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      on: { ...this.qListeners },
      attrs: {
        focusable: 'false' /* needed for IE11 */,
        'width': this.cSize,
        'height': this.cSize,
        'xmlns': 'http://www.w3.org/2000/svg',
        'viewBox': '0 0 100 100',
        'preserveAspectRatio': 'xMidYMid'
      }
    }, [
      h('circle', {
        attrs: {
          'cx': '50',
          'cy': '50',
          'r': '44',
          'fill': 'none',
          'stroke-width': '4',
          'stroke-opacity': '.5',
          'stroke': 'currentColor'
        }
      }),
      h('circle', {
        attrs: {
          'cx': '8',
          'cy': '54',
          'r': '6',
          'fill': 'currentColor',
          'stroke-width': '3',
          'stroke': 'currentColor'
        }
      }, [
        h('animateTransform', {
          attrs: {
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 48',
            'to': '360 50 52',
            'dur': '2s',
            'repeatCount': 'indefinite'
          }
        })
      ])
    ])
  }
})
