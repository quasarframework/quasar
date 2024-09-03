import { h } from 'vue'

import useSpinner, { useSpinnerProps } from './use-spinner.js'

import { createComponent } from '../../utils/private.create/create.js'

const svg = [
  h('g', {
    transform: 'translate(1 1)',
    'stroke-width': '2',
    fill: 'none',
    'fill-rule': 'evenodd'
  }, [
    h('circle', {
      'stroke-opacity': '.5',
      cx: '18',
      cy: '18',
      r: '18'
    }),
    h('path', {
      d: 'M36 18c0-9.94-8.06-18-18-18'
    }, [
      h('animateTransform', {
        attributeName: 'transform',
        type: 'rotate',
        from: '0 18 18',
        to: '360 18 18',
        dur: '1s',
        repeatCount: 'indefinite'
      })
    ])
  ])
]

export default createComponent({
  name: 'QSpinnerOval',

  props: useSpinnerProps,

  setup (props) {
    const { cSize, classes } = useSpinner(props)

    return () => h('svg', {
      class: classes.value,
      stroke: 'currentColor',
      width: cSize.value,
      height: cSize.value,
      viewBox: '0 0 38 38',
      xmlns: 'http://www.w3.org/2000/svg'
    }, svg)
  }
})
