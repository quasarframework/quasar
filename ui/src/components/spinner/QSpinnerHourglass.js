import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerHourglass',

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
      h('g', [
        h('path', {
          staticClass: 'glass',
          attrs: {
            'fill': 'none',
            'stroke': 'currentColor',
            'stroke-width': '5',
            'stroke-miterlimit': '10',
            'd': 'M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z'
          }
        }),
        h('clipPath', {
          attrs: {
            'id': 'uil-hourglass-clip1'
          }
        }, [
          h('rect', {
            staticClass: 'clip',
            attrs: {
              'x': '15',
              'y': '20',
              'width': '70',
              'height': '25'
            }
          }, [
            h('animate', {
              attrs: {
                'attributeName': 'height',
                'from': '25',
                'to': '0',
                'dur': '1s',
                'repeatCount': 'indefinite',
                'values': '25;0;0',
                'keyTimes': '0;0.5;1'
              }
            }),
            h('animate', {
              attrs: {
                'attributeName': 'y',
                'from': '20',
                'to': '45',
                'dur': '1s',
                'repeatCount': 'indefinite',
                'values': '20;45;45',
                'keyTimes': '0;0.5;1'
              }
            })
          ])
        ]),
        h('clipPath', {
          attrs: {
            'id': 'uil-hourglass-clip2'
          }
        }, [
          h('rect', {
            staticClass: 'clip',
            attrs: {
              'x': '15',
              'y': '55',
              'width': '70',
              'height': '25'
            }
          }, [
            h('animate', {
              attrs: {
                'attributeName': 'height',
                'from': '0',
                'to': '25',
                'dur': '1s',
                'repeatCount': 'indefinite',
                'values': '0;25;25',
                'keyTimes': '0;0.5;1'
              }
            }),
            h('animate', {
              attrs: {
                'attributeName': 'y',
                'from': '80',
                'to': '55',
                'dur': '1s',
                'repeatCount': 'indefinite',
                'values': '80;55;55',
                'keyTimes': '0;0.5;1'
              }
            })
          ])
        ]),
        h('path', {
          staticClass: 'sand',
          attrs: {
            'd': 'M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z',
            'clip-path': 'url(#uil-hourglass-clip1)',
            'fill': 'currentColor'
          }
        }),
        h('path', {
          staticClass: 'sand',
          attrs: {
            'd': 'M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z',
            'clip-path': 'url(#uil-hourglass-clip2)',
            'fill': 'currentColor'
          }
        }),
        h('animateTransform', {
          attrs: {
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 50',
            'to': '180 50 50',
            'repeatCount': 'indefinite',
            'dur': '1s',
            'values': '0 50 50;0 50 50;180 50 50',
            'keyTimes': '0;0.7;1'
          }
        })
      ])
    ])
  }
})
