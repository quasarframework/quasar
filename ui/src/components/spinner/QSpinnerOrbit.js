import { h, defineComponent } from 'vue'

import mixin from './spinner-mixin.js'

const svg = [
  h('circle', {
    cx: '50',
    cy: '50',
    r: '44',
    fill: 'none',
    'stroke-width': '4',
    'stroke-opacity': '.5',
    stroke: 'currentColor'
  }),
  h('circle', {
    cx: '8',
    cy: '54',
    r: '6',
    fill: 'currentColor',
    'stroke-width': '3',
    stroke: 'currentColor'
  }, [
    h('animateTransform', {
      attributeName: 'transform',
      type: 'rotate',
      from: '0 50 48',
      to: '360 50 52',
      dur: '2s',
      repeatCount: 'indefinite'
    })
  ])
]

export default defineComponent({
  name: 'QSpinnerOrbit',

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
