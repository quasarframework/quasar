import { h } from 'vue'

import useSpinner, { useSpinnerProps } from './use-spinner.js'

import { createComponent } from '../../utils/private/create.js'

const svg = [
  h('defs', [
    h('linearGradient', {
      x1: '8.042%',
      y1: '0%',
      x2: '65.682%',
      y2: '23.865%',
      id: 'a'
    }, [
      h('stop', {
        'stop-color': 'currentColor',
        'stop-opacity': '0',
        offset: '0%'
      }),
      h('stop', {
        'stop-color': 'currentColor',
        'stop-opacity': '.631',
        offset: '63.146%'
      }),
      h('stop', {
        'stop-color': 'currentColor',
        offset: '100%'
      })
    ])
  ]),
  h('g', {
    transform: 'translate(1 1)',
    fill: 'none',
    'fill-rule': 'evenodd'
  }, [
    h('path', {
      d: 'M36 18c0-9.94-8.06-18-18-18',
      stroke: 'url(#a)',
      'stroke-width': '2'
    }, [
      h('animateTransform', {
        attributeName: 'transform',
        type: 'rotate',
        from: '0 18 18',
        to: '360 18 18',
        dur: '0.9s',
        repeatCount: 'indefinite'
      })
    ]),
    h('circle', {
      fill: 'currentColor',
      cx: '36',
      cy: '18',
      r: '1'
    }, [
      h('animateTransform', {
        attributeName: 'transform',
        type: 'rotate',
        from: '0 18 18',
        to: '360 18 18',
        dur: '0.9s',
        repeatCount: 'indefinite'
      })
    ])
  ])
]

export default createComponent({
  name: 'QSpinnerTail',

  props: useSpinnerProps,

  setup (props) {
    const { cSize, classes } = useSpinner(props)

    return () => h('svg', {
      class: classes.value,
      width: cSize.value,
      height: cSize.value,
      viewBox: '0 0 38 38',
      xmlns: 'http://www.w3.org/2000/svg'
    }, svg)
  }
})
