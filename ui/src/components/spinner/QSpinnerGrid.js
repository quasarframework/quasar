import { h } from 'vue'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'
import { createComponent } from '../../utils/private.create/create.js'

const innerHTML =
  '<circle cx="12.5" cy="12.5" r="12.5"></circle><circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5" style="animation-delay:-.9s"></circle><circle cx="52.5" cy="12.5" r="12.5" style="animation-delay:-.7s"></circle><circle cx="52.5" cy="52.5" r="12.5" style="animation-delay:-.4s"></circle><circle cx="92.5" cy="12.5" r="12.5" style="animation-delay:-.2s"></circle><circle cx="92.5" cy="52.5" r="12.5" style="animation-delay:-.6s"></circle><circle cx="12.5" cy="92.5" r="12.5" style="animation-delay:-.3s"></circle><circle cx="52.5" cy="92.5" r="12.5" style="animation-delay:-.5s"></circle><circle cx="92.5" cy="92.5" r="12.5" style="animation-delay:-.8s"></circle>'

export default /*#__PURE__*/ createComponent({
  name: 'QSpinnerGrid',

  props: useSpinnerProps,

  setup(props) {
    return () => {
      const cSize = getSpinnerSize(props.size)
      return h('svg', {
        class: getSpinnerClass(props.color, 'grid'),
        fill: 'currentColor',
        width: cSize,
        height: cSize,
        viewBox: '0 0 105 105',
        xmlns: 'http://www.w3.org/2000/svg',
        innerHTML
      })
    }
  }
})
