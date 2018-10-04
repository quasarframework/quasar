import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerCube',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      attrs: {
        'width': this.size,
        'height': this.size,
        'xmlns': 'http://www.w3.org/2000/svg',
        'viewBox': '0 0 100 100',
        'preserveAspectRatio': 'xMidYMid'
      }
    }, [
      h('rect', {
        attrs: {
          'x': '0',
          'y': '0',
          'width': '100',
          'height': '100',
          'fill': 'none'
        }
      }),
      h('g', {
        attrs: {
          'transform': 'translate(25 25)'
        }
      }, [
        h('rect', {
          attrs: {
            'x': '-20',
            'y': '-20',
            'width': '40',
            'height': '40',
            'fill': 'currentColor',
            'opacity': '0.9'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'scale',
              'from': '1.5',
              'to': '1',
              'repeatCount': 'indefinite',
              'begin': '0s',
              'dur': '1s',
              'calcMode': 'spline',
              'keySplines': '0.2 0.8 0.2 0.8',
              'keyTimes': '0;1'
            }
          })
        ])
      ]),
      h('g', {
        attrs: {
          'transform': 'translate(75 25)'
        }
      }, [
        h('rect', {
          attrs: {
            'x': '-20',
            'y': '-20',
            'width': '40',
            'height': '40',
            'fill': 'currentColor',
            'opacity': '0.8'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'scale',
              'from': '1.5',
              'to': '1',
              'repeatCount': 'indefinite',
              'begin': '0.1s',
              'dur': '1s',
              'calcMode': 'spline',
              'keySplines': '0.2 0.8 0.2 0.8',
              'keyTimes': '0;1'
            }
          })
        ])
      ]),
      h('g', {
        attrs: {
          'transform': 'translate(25 75)'
        }
      }, [
        h('rect', {
          staticClass: 'cube',
          attrs: {
            'x': '-20',
            'y': '-20',
            'width': '40',
            'height': '40',
            'fill': 'currentColor',
            'opacity': '0.7'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'scale',
              'from': '1.5',
              'to': '1',
              'repeatCount': 'indefinite',
              'begin': '0.3s',
              'dur': '1s',
              'calcMode': 'spline',
              'keySplines': '0.2 0.8 0.2 0.8',
              'keyTimes': '0;1'
            }
          })
        ])
      ]),
      h('g', {
        attrs: {
          'transform': 'translate(75 75)'
        }
      }, [
        h('rect', {
          staticClass: 'cube',
          attrs: {
            'x': '-20',
            'y': '-20',
            'width': '40',
            'height': '40',
            'fill': 'currentColor',
            'opacity': '0.6'
          }
        }, [
          h('animateTransform', {
            attrs: {
              'attributeName': 'transform',
              'type': 'scale',
              'from': '1.5',
              'to': '1',
              'repeatCount': 'indefinite',
              'begin': '0.2s',
              'dur': '1s',
              'calcMode': 'spline',
              'keySplines': '0.2 0.8 0.2 0.8',
              'keyTimes': '0;1'
            }
          })
        ])
      ])
    ])
  }
})
