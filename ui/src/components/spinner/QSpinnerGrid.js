import { h, defineComponent } from 'vue'

import useSpinner, { useSpinnerProps } from './use-spinner.js'

const svg = [
  h('circle', {
    cx: '12.5',
    cy: '12.5',
    r: '12.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '0s',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('circle', {
    cx: '12.5',
    cy: '52.5',
    r: '12.5',
    'fill-opacity': '.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '100ms',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('circle', {
    cx: '52.5',
    cy: '12.5',
    r: '12.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '300ms',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('circle', {
    cx: '52.5',
    cy: '52.5',
    r: '12.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '600ms',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('circle', {
    cx: '92.5',
    cy: '12.5',
    r: '12.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '800ms',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('circle', {
    cx: '92.5',
    cy: '52.5',
    r: '12.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '400ms',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('circle', {
    cx: '12.5',
    cy: '92.5',
    r: '12.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '700ms',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('circle', {
    cx: '52.5',
    cy: '92.5',
    r: '12.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '500ms',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('circle', {
    cx: '92.5',
    cy: '92.5',
    r: '12.5'
  }, [
    h('animate', {
      attributeName: 'fill-opacity',
      begin: '200ms',
      dur: '1s',
      values: '1;.2;1',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ])
]

export default defineComponent({
  name: 'QSpinnerGrid',

  props: useSpinnerProps,

  setup (props) {
    const { cSize, classes } = useSpinner(props)

    return () => h('svg', {
      class: classes.value,
      fill: 'currentColor',
      width: cSize.value,
      height: cSize.value,
      viewBox: '0 0 105 105',
      xmlns: 'http://www.w3.org/2000/svg'
    }, svg)
  }
})
