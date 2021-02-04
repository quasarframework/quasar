import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerComment',

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
      h('rect', {
        attrs: {
          'x': '0',
          'y': '0',
          'width': '100',
          'height': '100',
          'fill': 'none'
        }
      }),
      h('path', {
        attrs: {
          'd': 'M78,19H22c-6.6,0-12,5.4-12,12v31c0,6.6,5.4,12,12,12h37.2c0.4,3,1.8,5.6,3.7,7.6c2.4,2.5,5.1,4.1,9.1,4 c-1.4-2.1-2-7.2-2-10.3c0-0.4,0-0.8,0-1.3h8c6.6,0,12-5.4,12-12V31C90,24.4,84.6,19,78,19z',
          'fill': 'currentColor'
        }
      }),
      h('circle', {
        attrs: {
          'cx': '30',
          'cy': '47',
          'r': '5',
          'fill': '#fff'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'opacity',
            'from': '0',
            'to': '1',
            'values': '0;1;1',
            'keyTimes': '0;0.2;1',
            'dur': '1s',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '50',
          'cy': '47',
          'r': '5',
          'fill': '#fff'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'opacity',
            'from': '0',
            'to': '1',
            'values': '0;0;1;1',
            'keyTimes': '0;0.2;0.4;1',
            'dur': '1s',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '70',
          'cy': '47',
          'r': '5',
          'fill': '#fff'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'opacity',
            'from': '0',
            'to': '1',
            'values': '0;0;1;1',
            'keyTimes': '0;0.4;0.6;1',
            'dur': '1s',
            'repeatCount': 'indefinite'
          }
        })
      ])
    ])
  }
})
