import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerGrid',

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
        'viewBox': '0 0 105 105',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('circle', {
        attrs: {
          'cx': '12.5',
          'cy': '12.5',
          'r': '12.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '0s',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '12.5',
          'cy': '52.5',
          'r': '12.5',
          'fill-opacity': '.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '100ms',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '52.5',
          'cy': '12.5',
          'r': '12.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '300ms',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '52.5',
          'cy': '52.5',
          'r': '12.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '600ms',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '92.5',
          'cy': '12.5',
          'r': '12.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '800ms',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '92.5',
          'cy': '52.5',
          'r': '12.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '400ms',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '12.5',
          'cy': '92.5',
          'r': '12.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '700ms',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '52.5',
          'cy': '92.5',
          'r': '12.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '500ms',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('circle', {
        attrs: {
          'cx': '92.5',
          'cy': '92.5',
          'r': '12.5'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'fill-opacity',
            'begin': '200ms',
            'dur': '1s',
            'values': '1;.2;1',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ])
    ])
  }
})
