import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerPie',

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
        'viewBox': '0 0 100 100',
        'preserveAspectRatio': 'xMidYMid',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('path', {
        attrs: {
          'd': 'M0 50A50 50 0 0 1 50 0L50 50L0 50',
          'fill': 'currentColor',
          'opacity': '0.5'
        }
      }, [
        h('animateTransform', {
          attrs: {
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 50',
            'to': '360 50 50',
            'dur': '0.8s',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('path', {
        attrs: {
          'd': 'M50 0A50 50 0 0 1 100 50L50 50L50 0',
          'fill': 'currentColor',
          'opacity': '0.5'
        }
      }, [
        h('animateTransform', {
          attrs: {
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 50',
            'to': '360 50 50',
            'dur': '1.6s',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('path', {
        attrs: {
          'd': 'M100 50A50 50 0 0 1 50 100L50 50L100 50',
          'fill': 'currentColor',
          'opacity': '0.5'
        }
      }, [
        h('animateTransform', {
          attrs: {
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 50',
            'to': '360 50 50',
            'dur': '2.4s',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('path', {
        attrs: {
          'd': 'M50 100A50 50 0 0 1 0 50L50 50L50 100',
          'fill': 'currentColor',
          'opacity': '0.5'
        }
      }, [
        h('animateTransform', {
          attrs: {
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 50',
            'to': '360 50 50',
            'dur': '3.2s',
            'repeatCount': 'indefinite'
          }
        })
      ])
    ])
  }
})
