import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerTail',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      attrs: {
        'width': this.size,
        'height': this.size,
        'viewBox': '0 0 38 38',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('defs', [
        h('linearGradient', {
          attrs: {
            'x1': '8.042%',
            'y1': '0%',
            'x2': '65.682%',
            'y2': '23.865%',
            'id': 'a'
          }
        }, [
          h('stop', {
            attrs: {
              'stop-color': 'currentColor',
              'stop-opacity': '0',
              'offset': '0%'
            }
          }),
          h('stop', {
            attrs: {
              'stop-color': 'currentColor',
              'stop-opacity': '.631',
              'offset': '63.146%'
            }
          }),
          h('stop', {
            attrs: {
              'stop-color': 'currentColor',
              'offset': '100%'
            }
          })
        ])
      ]),
      h('g', {
        attrs: {
          'transform': 'translate(1 1)',
          'fill': 'none',
          'fill-rule': 'evenodd'
        }
      }, [
        h('path', {
          attrs: {
            'd': 'M36 18c0-9.94-8.06-18-18-18',
            'stroke': 'url(#a)',
            'stroke-width': '2'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'rotate',
              'from': '0 18 18',
              'to': '360 18 18',
              'dur': '0.9s',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('circle', {
          attrs: {
            'fill': 'currentColor',
            'cx': '36',
            'cy': '18',
            'r': '1'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'rotate',
              'from': '0 18 18',
              'to': '360 18 18',
              'dur': '0.9s',
              'repeatCount': 'indefinite'
            }
          })
        ])
      ])
    ])
  }
})
