import { h } from 'vue'

import useSpinner, { useSpinnerProps } from './use-spinner.js'

import { createComponent } from '../../utils/private/create.js'

const svg = [
  h('path', {
    d: 'M0 50A50 50 0 0 1 50 0L50 50L0 50',
    fill: 'currentColor',
    opacity: '0.5'
  }, [
    h('animateTransform', {
      attributeName: 'transform',
      type: 'rotate',
      from: '0 50 50',
      to: '360 50 50',
      dur: '0.8s',
      repeatCount: 'indefinite'
    })
  ]),
  h('path', {
    d: 'M50 0A50 50 0 0 1 100 50L50 50L50 0',
    fill: 'currentColor',
    opacity: '0.5'
  }, [
    h('animateTransform', {
      attributeName: 'transform',
      type: 'rotate',
      from: '0 50 50',
      to: '360 50 50',
      dur: '1.6s',
      repeatCount: 'indefinite'
    })
  ]),
  h('path', {
    d: 'M100 50A50 50 0 0 1 50 100L50 50L100 50',
    fill: 'currentColor',
    opacity: '0.5'
  }, [
    h('animateTransform', {
      attributeName: 'transform',
      type: 'rotate',
      from: '0 50 50',
      to: '360 50 50',
      dur: '2.4s',
      repeatCount: 'indefinite'
    })
  ]),
  h('path', {
    d: 'M50 100A50 50 0 0 1 0 50L50 50L50 100',
    fill: 'currentColor',
    opacity: '0.5'
  }, [
    h('animateTransform', {
      attributeName: 'transform',
      type: 'rotate',
      from: '0 50 50',
      to: '360 50 50',
      dur: '3.2s',
      repeatCount: 'indefinite'
    })
  ])
]

export default createComponent({
  name: 'QSpinnerPie',

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
