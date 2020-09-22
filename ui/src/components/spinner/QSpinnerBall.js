import { h, defineComponent } from 'vue'

import mixin from './spinner-mixin.js'

const svg = [
  h('g', {
    transform: 'translate(1 1)',
    'stroke-width': '2',
    fill: 'none',
    'fill-rule': 'evenodd'
  }, [
    h('circle', {
      cx: '5',
      cy: '50',
      r: '5'
    }, [
      h('animate', {
        attributeName: 'cy',
        begin: '0s',
        dur: '2.2s',
        values: '50;5;50;50',
        calcMode: 'linear',
        repeatCount: 'indefinite'
      }),
      h('animate', {
        attributeName: 'cx',
        begin: '0s',
        dur: '2.2s',
        values: '5;27;49;5',
        calcMode: 'linear',
        repeatCount: 'indefinite'
      })
    ]),
    h('circle', {
      cx: '27',
      cy: '5',
      r: '5'
    }, [
      h('animate', {
        attributeName: 'cy',
        begin: '0s',
        dur: '2.2s',
        from: '5',
        to: '5',
        values: '5;50;50;5',
        calcMode: 'linear',
        repeatCount: 'indefinite'
      }),
      h('animate', {
        attributeName: 'cx',
        begin: '0s',
        dur: '2.2s',
        from: '27',
        to: '27',
        values: '27;49;5;27',
        calcMode: 'linear',
        repeatCount: 'indefinite'
      })
    ]),
    h('circle', {
      cx: '49',
      cy: '50',
      r: '5'
    }, [
      h('animate', {
        attributeName: 'cy',
        begin: '0s',
        dur: '2.2s',
        values: '50;50;5;50',
        calcMode: 'linear',
        repeatCount: 'indefinite'
      }),
      h('animate', {
        attributeName: 'cx',
        from: '49',
        to: '49',
        begin: '0s',
        dur: '2.2s',
        values: '49;5;27;49',
        calcMode: 'linear',
        repeatCount: 'indefinite'
      })
    ])
  ])
]

export default defineComponent({
  name: 'QSpinnerBall',

  mixins: [ mixin ],

  render () {
    return h('svg', {
      class: this.classes,
      focusable: 'false' /* needed for IE11 */,
      stroke: 'currentColor',
      width: this.cSize,
      height: this.cSize,
      viewBox: '0 0 57 57',
      xmlns: 'http://www.w3.org/2000/svg'
    }, svg)
  }
})
