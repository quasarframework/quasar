import { h } from 'vue'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'
import { createComponent } from '../../utils/private.create/create.js'

const innerHTML =
  '<circle cx="15" cy="15" r="15"></circle><circle cx="60" cy="15" r="9" fill-opacity=".3" style="animation-delay:-.4s"></circle><circle cx="105" cy="15" r="15"></circle>'

export default /*#__PURE__*/ createComponent({
  name: 'QSpinnerDots',

  props: useSpinnerProps,

  setup(props) {
    return () => {
      const cSize = getSpinnerSize(props.size)
      return h('svg', {
        class: getSpinnerClass(props.color, 'dots'),
        fill: 'currentColor',
        width: cSize,
        height: cSize,
        viewBox: '0 0 120 30',
        xmlns: 'http://www.w3.org/2000/svg',
        innerHTML
      })
    }
  }
})
