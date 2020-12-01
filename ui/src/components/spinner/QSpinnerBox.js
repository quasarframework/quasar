import { h, defineComponent } from 'vue'

import useSpinner, { useSpinnerProps } from './use-spinner.js'

const svg = [
  h('rect', {
    x: '25',
    y: '25',
    width: '50',
    height: '50',
    fill: 'none',
    'stroke-width': '4',
    stroke: 'currentColor'
  }, [
    h('animateTransform', {
      id: 'spinnerBox',
      attributeName: 'transform',
      type: 'rotate',
      from: '0 50 50',
      to: '180 50 50',
      dur: '0.5s',
      begin: 'rectBox.end'
    })
  ]),
  h('rect', {
    x: '27',
    y: '27',
    width: '46',
    height: '50',
    fill: 'currentColor'
  }, [
    h('animate', {
      id: 'rectBox',
      attributeName: 'height',
      begin: '0s;spinnerBox.end',
      dur: '1.3s',
      from: '50',
      to: '0',
      fill: 'freeze'
    })
  ])
]

export default defineComponent({
  name: 'QSpinnerBox',

  props: useSpinnerProps,

  setup (props) {
    const { cSize, classes } = useSpinner(props)

    return () => h('svg', {
      class: classes.value,
      width: cSize.value,
      height: cSize.value,
      viewBox: '0 0 100 100',
      preserveAspectRatio: 'xMidYMid',
      xmlns: 'http://www.w3.org/2000/svg'
    }, svg)
  }
})
