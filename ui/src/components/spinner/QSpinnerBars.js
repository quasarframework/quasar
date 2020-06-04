import Vue from 'vue'

import mixin from './spinner-mixin.js'

export default Vue.extend({
  name: 'QSpinnerBars',

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
        'viewBox': '0 0 135 140',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('rect', {
        attrs: {
          'y': '10',
          'width': '15',
          'height': '120',
          'rx': '6'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'height',
            'begin': '0.5s',
            'dur': '1s',
            'values': '120;110;100;90;80;70;60;50;40;140;120',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        }),
        h('animate', {
          attrs: {
            'attributeName': 'y',
            'begin': '0.5s',
            'dur': '1s',
            'values': '10;15;20;25;30;35;40;45;50;0;10',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('rect', {
        attrs: {
          'x': '30',
          'y': '10',
          'width': '15',
          'height': '120',
          'rx': '6'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'height',
            'begin': '0.25s',
            'dur': '1s',
            'values': '120;110;100;90;80;70;60;50;40;140;120',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        }),
        h('animate', {
          attrs: {
            'attributeName': 'y',
            'begin': '0.25s',
            'dur': '1s',
            'values': '10;15;20;25;30;35;40;45;50;0;10',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('rect', {
        attrs: {
          'x': '60',
          'width': '15',
          'height': '140',
          'rx': '6'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'height',
            'begin': '0s',
            'dur': '1s',
            'values': '120;110;100;90;80;70;60;50;40;140;120',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        }),
        h('animate', {
          attrs: {
            'attributeName': 'y',
            'begin': '0s',
            'dur': '1s',
            'values': '10;15;20;25;30;35;40;45;50;0;10',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('rect', {
        attrs: {
          'x': '90',
          'y': '10',
          'width': '15',
          'height': '120',
          'rx': '6'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'height',
            'begin': '0.25s',
            'dur': '1s',
            'values': '120;110;100;90;80;70;60;50;40;140;120',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        }),
        h('animate', {
          attrs: {
            'attributeName': 'y',
            'begin': '0.25s',
            'dur': '1s',
            'values': '10;15;20;25;30;35;40;45;50;0;10',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ]),
      h('rect', {
        attrs: {
          'x': '120',
          'y': '10',
          'width': '15',
          'height': '120',
          'rx': '6'
        }
      }, [
        h('animate', {
          attrs: {
            'attributeName': 'height',
            'begin': '0.5s',
            'dur': '1s',
            'values': '120;110;100;90;80;70;60;50;40;140;120',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        }),
        h('animate', {
          attrs: {
            'attributeName': 'y',
            'begin': '0.5s',
            'dur': '1s',
            'values': '10;15;20;25;30;35;40;45;50;0;10',
            'calcMode': 'linear',
            'repeatCount': 'indefinite'
          }
        })
      ])
    ])
  }
})
