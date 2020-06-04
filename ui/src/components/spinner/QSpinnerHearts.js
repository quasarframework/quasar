import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerHearts',

  mixins: [mixin],

  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      on: { ...this.qListeners },
      attrs: {
        focusable: 'false' /* needed for IE11 */,
        'fill': 'currentColor',
        'width': this.cSize,
        'height': this.cSize,
        'viewBox': '0 0 140 64',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('path', {
        attrs: {
          'd': 'M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.716-6.002 11.47-7.65 17.304-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z',
          'fill-opacity': '.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '0s',
            'dur': '1.4s',
            'values': '0.5;1;0.5',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('path', {
        attrs: {
          'd': 'M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.593-2.32 17.308 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z',
          'fill-opacity': '.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '0.7s',
            'dur': '1.4s',
            'values': '0.5;1;0.5',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('path', {
        attrs: {
          'd': 'M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z'
        }
      })
    ])
  }
})
