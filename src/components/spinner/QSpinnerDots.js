import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerDots',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      attrs: {
        'fill': 'currentColor',
        'width': this.size,
        'height': this.size,
        'viewBox': '0 0 120 30',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('circle', {
        attrs: {
          'cx': '15',
          'cy': '15',
          'r': '15'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'r',
            'from': '15',
            'to': '15',
            'begin': '0s',
            'dur': '0.8s',
            'values': '15;9;15',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        }),
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'from': '1',
            'to': '1',
            'begin': '0s',
            'dur': '0.8s',
            'values': '1;.5;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '60',
          'cy': '15',
          'r': '9',
          'fill-opacity': '.3'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'r',
            'from': '9',
            'to': '9',
            'begin': '0s',
            'dur': '0.8s',
            'values': '9;15;9',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        }),
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'from': '.5',
            'to': '.5',
            'begin': '0s',
            'dur': '0.8s',
            'values': '.5;1;.5',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '105',
          'cy': '15',
          'r': '15'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'r',
            'from': '15',
            'to': '15',
            'begin': '0s',
            'dur': '0.8s',
            'values': '15;9;15',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        }),
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'from': '1',
            'to': '1',
            'begin': '0s',
            'dur': '0.8s',
            'values': '1;.5;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ])
    ])
  }
})
