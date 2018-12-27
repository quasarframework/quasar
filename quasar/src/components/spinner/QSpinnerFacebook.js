import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerFacebook',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      attrs: {
        'width': this.size,
        'height': this.size,
        'viewBox': '0 0 100 100',
        'xmlns': 'http://www.w3.org/2000/svg',
        'preserveAspectRatio': 'xMidYMid'
      }
    }, [
      h('g', {
        attrs: {
          'transform': 'translate(20 50)'
        }
      }, [
        h('rect', {
          attrs: {
            'x': '-10',
            'y': '-30',
            'width': '20',
            'height': '60',
            'fill': 'currentColor',
            'opacity': '0.6'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'scale',
              'from': '2',
              'to': '1',
              'begin': '0s',
              'repeatCount': 'indefinite',
              'dur': '1s',
              'calcMode': 'spline',
              'keySplines': '0.1 0.9 0.4 1',
              'keyTimes': '0;1',
              'values': '2;1'
            }
          })
        ])
      ]),
      h('g', {
        attrs: {
          'transform': 'translate(50 50)'
        }
      }, [
        h('rect', {
          attrs: {
            'x': '-10',
            'y': '-30',
            'width': '20',
            'height': '60',
            'fill': 'currentColor',
            'opacity': '0.8'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'scale',
              'from': '2',
              'to': '1',
              'begin': '0.1s',
              'repeatCount': 'indefinite',
              'dur': '1s',
              'calcMode': 'spline',
              'keySplines': '0.1 0.9 0.4 1',
              'keyTimes': '0;1',
              'values': '2;1'
            }
          })
        ])
      ]),
      h('g', {
        attrs: {
          'transform': 'translate(80 50)'
        }
      }, [
        h('rect', {
          attrs: {
            'x': '-10',
            'y': '-30',
            'width': '20',
            'height': '60',
            'fill': 'currentColor',
            'opacity': '0.9'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'scale',
              'from': '2',
              'to': '1',
              'begin': '0.2s',
              'repeatCount': 'indefinite',
              'dur': '1s',
              'calcMode': 'spline',
              'keySplines': '0.1 0.9 0.4 1',
              'keyTimes': '0;1',
              'values': '2;1'
            }
          })
        ])
      ])
    ])
  }
})
