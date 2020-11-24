import { h, defineComponent } from 'vue'

import mixin from './spinner-mixin.js'

const svg = [
  h('circle', {
    cx: '50',
    cy: '50',
    r: '48',
    fill: 'none',
    'stroke-width': '4',
    'stroke-miterlimit': '10',
    stroke: 'currentColor'
  }),
  h('line', {
    'stroke-linecap': 'round',
    'stroke-width': '4',
    'stroke-miterlimit': '10',
    stroke: 'currentColor',
    x1: '50',
    y1: '50',
    x2: '85',
    y2: '50.5'
  }, [
    h('animateTransform', {
      attributeName: 'transform',
      type: 'rotate',
      from: '0 50 50',
      to: '360 50 50',
      dur: '2s',
      repeatCount: 'indefinite'
    })
  ]),
  h('line', {
    'stroke-linecap': 'round',
    'stroke-width': '4',
    'stroke-miterlimit': '10',
    stroke: 'currentColor',
    x1: '50',
    y1: '50',
    x2: '49.5',
    y2: '74'
  }, [
    h('animateTransform', {
      attributeName: 'transform',
      type: 'rotate',
      from: '0 50 50',
      to: '360 50 50',
      dur: '15s',
      repeatCount: 'indefinite'
    })
  ])
]

export default defineComponent({
  name: 'QSpinnerClock',

  mixins: [mixin],

  render () {
    return h('svg', {
      class: this.classes,
      width: this.cSize,
      height: this.cSize,
      viewBox: '0 0 100 100',
      preserveAspectRatio: 'xMidYMid',
      xmlns: 'http://www.w3.org/2000/svg'
    }, svg)
  }
})
