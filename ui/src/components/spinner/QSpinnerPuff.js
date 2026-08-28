import { h } from 'vue'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'
import { createComponent } from '../../utils/private.create/create.js'

const innerHTML =
  '<g fill="none" fill-rule="evenodd" stroke-width="2"><circle cx="22" cy="22" r="1"></circle><circle cx="22" cy="22" r="1" style="animation-delay:-.9s"></circle></g>'

export default /*#__PURE__*/ createComponent({
  name: 'QSpinnerPuff',

  props: useSpinnerProps,

  setup(props) {
    return () => {
      const cSize = getSpinnerSize(props.size)
      return h('svg', {
        class: getSpinnerClass(props.color, 'puff'),
        stroke: 'currentColor',
        width: cSize,
        height: cSize,
        viewBox: '0 0 44 44',
        xmlns: 'http://www.w3.org/2000/svg',
        innerHTML
      })
    }
  }
})
