import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerRadio',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      attrs: {
        'width': this.size,
        'height': this.size,
        'viewBox': '0 0 100 100',
        'preserveAspectRatio': 'xMidYMid',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('g', {
        attrs: {
          'transform': 'scale(0.55)'
        }
      }, [
        h('circle', {
          attrs: {
            'cx': '30',
            'cy': '150',
            'r': '30',
            'fill': 'currentColor'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'opacity',
              'from': '0',
              'to': '1',
              'dur': '1s',
              'begin': '0',
              'repeatCount': 'indefinite',
              'keyTimes': '0;0.5;1',
              'values': '0;1;1'
            }
          })
        ]),
        h('path', {
          attrs: {
            'd': 'M90,150h30c0-49.7-40.3-90-90-90v30C63.1,90,90,116.9,90,150z',
            'fill': 'currentColor'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'opacity',
              'from': '0',
              'to': '1',
              'dur': '1s',
              'begin': '0.1',
              'repeatCount': 'indefinite',
              'keyTimes': '0;0.5;1',
              'values': '0;1;1'
            }
          })
        ]),
        h('path', {
          attrs: {
            'd': 'M150,150h30C180,67.2,112.8,0,30,0v30C96.3,30,150,83.7,150,150z',
            'fill': 'currentColor'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'opacity',
              'from': '0',
              'to': '1',
              'dur': '1s',
              'begin': '0.2',
              'repeatCount': 'indefinite',
              'keyTimes': '0;0.5;1',
              'values': '0;1;1'
            }
          })
        ])
      ])
    ])
  }
})
