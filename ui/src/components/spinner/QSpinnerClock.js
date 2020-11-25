import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerClock',

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
          'r': '48',
          'fill': 'none',
          'stroke-width': '4',
          'stroke-miterlimit': '10',
          'stroke': 'currentColor'
        }
      }),
      h('line', {
        attrs: {
          'stroke-linecap': 'round',
          'stroke-width': '4',
          'stroke-miterlimit': '10',
          'stroke': 'currentColor',
          'x1': '50',
          'y1': '50',
          'x2': '85',
          'y2': '50.5'
        }
      }, [
        h('animateTransform', {
          attrs: {
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 50',
            'to': '360 50 50',
            'dur': '2s',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('line', {
        attrs: {
          'stroke-linecap': 'round',
          'stroke-width': '4',
          'stroke-miterlimit': '10',
          'stroke': 'currentColor',
          'x1': '50',
          'y1': '50',
          'x2': '49.5',
          'y2': '74'
        }
      }, [
        h('animateTransform', {
          attrs: {
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 50',
            'to': '360 50 50',
            'dur': '15s',
            'repeatCount': 'indefinite'
          }
        })
      ])
    ])
  }
})
