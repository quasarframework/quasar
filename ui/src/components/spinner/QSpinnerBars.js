import { h, defineComponent } from 'vue'

import useSpinner, { useSpinnerProps } from './use-spinner.js'

const svg = [
  h('rect', {
    y: '10',
    width: '15',
    height: '120',
    rx: '6'
  }, [
    h('animate', {
      attributeName: 'height',
      begin: '0.5s',
      dur: '1s',
      values: '120;110;100;90;80;70;60;50;40;140;120',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    }),
    h('animate', {
      attributeName: 'y',
      begin: '0.5s',
      dur: '1s',
      values: '10;15;20;25;30;35;40;45;50;0;10',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('rect', {
    x: '30',
    y: '10',
    width: '15',
    height: '120',
    rx: '6'
  }, [
    h('animate', {
      attributeName: 'height',
      begin: '0.25s',
      dur: '1s',
      values: '120;110;100;90;80;70;60;50;40;140;120',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    }),
    h('animate', {
      attributeName: 'y',
      begin: '0.25s',
      dur: '1s',
      values: '10;15;20;25;30;35;40;45;50;0;10',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('rect', {
    x: '60',
    width: '15',
    height: '140',
    rx: '6'
  }, [
    h('animate', {
      attributeName: 'height',
      begin: '0s',
      dur: '1s',
      values: '120;110;100;90;80;70;60;50;40;140;120',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    }),
    h('animate', {
      attributeName: 'y',
      begin: '0s',
      dur: '1s',
      values: '10;15;20;25;30;35;40;45;50;0;10',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('rect', {
    x: '90',
    y: '10',
    width: '15',
    height: '120',
    rx: '6'
  }, [
    h('animate', {
      attributeName: 'height',
      begin: '0.25s',
      dur: '1s',
      values: '120;110;100;90;80;70;60;50;40;140;120',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    }),
    h('animate', {
      attributeName: 'y',
      begin: '0.25s',
      dur: '1s',
      values: '10;15;20;25;30;35;40;45;50;0;10',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ]),
  h('rect', {
    x: '120',
    y: '10',
    width: '15',
    height: '120',
    rx: '6'
  }, [
    h('animate', {
      attributeName: 'height',
      begin: '0.5s',
      dur: '1s',
      values: '120;110;100;90;80;70;60;50;40;140;120',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    }),
    h('animate', {
      attributeName: 'y',
      begin: '0.5s',
      dur: '1s',
      values: '10;15;20;25;30;35;40;45;50;0;10',
      calcMode: 'linear',
      repeatCount: 'indefinite'
    })
  ])
]

export default defineComponent({
  name: 'QSpinnerBars',

  props: useSpinnerProps,

  setup (props) {
    const { cSize, classes } = useSpinner(props)

    return () => h('svg', {
      class: classes.value,
      fill: 'currentColor',
      width: cSize.value,
      height: cSize.value,
      viewBox: '0 0 135 140',
      xmlns: 'http://www.w3.org/2000/svg'
    }, svg)
  }
})
