import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerBox',

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
          'x': '25',
          'y': '25',
          'width': '50',
          'height': '50',
          'fill': 'none',
          'stroke-width': '4',
          'stroke': 'currentColor'
        }
      }, [
        h('animateTransform', {
          attrs: {
            'id': 'spinnerBox',
            'attributeName': 'transform',
            'type': 'rotate',
            'from': '0 50 50',
            'to': '180 50 50',
            'dur': '0.5s',
            'begin': 'rectBox.end'
          }
        })
      ]),
      h('rect', {
        attrs: {
          'x': '27',
          'y': '27',
          'width': '46',
          'height': '50',
          'fill': 'currentColor'
        }
      }, [
        h('animate', {
          attrs: {
            'id': 'rectBox',
            'attributeName': 'height',
            'begin': '0s;spinnerBox.end',
            'dur': '1.3s',
            'from': '50',
            'to': '0',
            'fill': 'freeze'
          }
        })
      ])
    ])
  }
})
