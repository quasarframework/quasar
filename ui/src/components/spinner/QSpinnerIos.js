import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerIos',

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
        'stroke': 'currentColor',
        'fill': 'currentColor',
        'viewBox': '0 0 64 64'
      }
    }, [
      h('g', {
        attrs: {
          'stroke-width': '4',
          'stroke-linecap': 'round'
        }
      }, [
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(180)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(210)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(240)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(270)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(300)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(330)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(0)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(30)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(60)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(90)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(120)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85',
              'repeatCount': 'indefinite'
            }
          })
        ]),
        h('line', {
          attrs: {
            'y1': '17',
            'y2': '29',
            'transform': 'translate(32,32) rotate(150)'
          }
        }, [
          h('animate', {
            attrs: {
              'attributeName': 'stroke-opacity',
              'dur': '750ms',
              'values': '1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1',
              'repeatCount': 'indefinite'
            }
          })
        ])
      ])
    ])
  }
})
