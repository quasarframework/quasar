import { h } from 'vue'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'
import { createComponent } from '../../utils/private.create/create.js'

const innerHTML =
  '<g stroke-width="4" stroke-linecap="round"><line y1="17" y2="29" transform="translate(32,32) rotate(180)" style="animation-delay:-750ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(210)" style="animation-delay:-681.8ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(240)" style="animation-delay:-613.6ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(270)" style="animation-delay:-545.5ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(300)" style="animation-delay:-477.3ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(330)" style="animation-delay:-409.1ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(0)" style="animation-delay:-340.9ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(30)" style="animation-delay:-272.7ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(60)" style="animation-delay:-204.5ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(90)" style="animation-delay:-136.4ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(120)" style="animation-delay:-68.2ms"></line><line y1="17" y2="29" transform="translate(32,32) rotate(150)"></line></g>'

export default /*#__PURE__*/ createComponent({
  name: 'QSpinnerIos',

  props: useSpinnerProps,

  setup(props) {
    return () => {
      const cSize = getSpinnerSize(props.size)
      return h('svg', {
        class: getSpinnerClass(props.color, 'ios'),
        width: cSize,
        height: cSize,
        stroke: 'currentColor',
        fill: 'currentColor',
        viewBox: '0 0 64 64',
        innerHTML
      })
    }
  }
})
