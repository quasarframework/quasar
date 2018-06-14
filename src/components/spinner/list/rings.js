import mixin from '../spinner-mixin'

export default {
  name: 'QSpinnerRings',
  mixins: [mixin],
  render (h) {
    return h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      attrs: {
        'stroke': 'currentColor',
        'width': this.size,
        'height': this.size,
        'viewBox': '0 0 45 45',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('g', {
        attrs: {
          'fill': 'none',
          'fill-rule': 'evenodd',
          'transform': 'translate(1 1)',
          'stroke-width': '2'
        }
      }, [
        h('circle', {
          attrs: {
            'cx': '22',
            'cy': '22',
            'r': '6'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'r',
              'begin': '1.5s',
              'dur': '3s',
              'values': '6;22',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          }),
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'begin': '1.5s',
              'dur': '3s',
              'values': '1;0',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          }),
          h('animate', {
            attrs: {
              'attributeName': 'stroke-width',
              'begin': '1.5s',
              'dur': '3s',
              'values': '2;0',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('circle', {
          attrs: {
            'cx': '22',
            'cy': '22',
            'r': '6'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'r',
              'begin': '3s',
              'dur': '3s',
              'values': '6;22',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          }),
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'begin': '3s',
              'dur': '3s',
              'values': '1;0',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          }),
          h('animate', {
            attrs: {
              'attributeName': 'stroke-width',
              'begin': '3s',
              'dur': '3s',
              'values': '2;0',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('circle', {
          attrs: {
            'cx': '22',
            'cy': '22',
            'r': '8'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'r',
              'begin': '0s',
              'dur': '1.5s',
              'values': '6;1;2;3;4;5;6',
              'calcMode': 'linear',
              'repeatCount': 'indefinite'
            }
          })
        ])
      ])
    ])
  }
}
