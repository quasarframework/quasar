import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerBall',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      attrs: {
        'stroke': 'currentColor',
        'width': this.size,
        'height': this.size,
        'viewBox': '0 0 57 57',
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
            'cx': '5',
            'cy': '50',
            'r': '5'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'cy',
              'begin': '0s',
              'dur': '2.2s',
              'values': '50;5;50;50',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          }),
          h('animate', {
            attrs: {
              'attributeName': 'cx',
              'begin': '0s',
              'dur': '2.2s',
              'values': '5;27;49;5',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('circle', {
          attrs: {
            'cx': '27',
            'cy': '5',
            'r': '5'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'cy',
              'begin': '0s',
              'dur': '2.2s',
              'from': '5',
              'to': '5',
              'values': '5;50;50;5',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          }),
          h('animate', {
            attrs: {
              'attributeName': 'cx',
              'begin': '0s',
              'dur': '2.2s',
              'from': '27',
              'to': '27',
              'values': '27;49;5;27',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('circle', {
          attrs: {
            'cx': '49',
            'cy': '50',
            'r': '5'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'cy',
              'begin': '0s',
              'dur': '2.2s',
              'values': '50;50;5;50',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          }),
          h('animate', {
            attrs: {
              'attributeName': 'cx',
              'from': '49',
              'to': '49',
              'begin': '0s',
              'dur': '2.2s',
              'values': '49;5;27;49',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          })
        ])
      ])
    ])
  }
})
