import { h } from 'vue'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'
import { createComponent } from '../../utils/private.create/create.js'

const innerHTML =
  '<g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2"><circle cx="22" cy="22" r="6" style="animation-delay:-1.5s"></circle><circle cx="22" cy="22" r="6"></circle><circle cx="22" cy="22" r="8"></circle></g>'

export default /*#__PURE__*/ createComponent({
  name: 'QSpinnerRings',

  props: useSpinnerProps,

  setup(props) {
    return () => {
      const cSize = getSpinnerSize(props.size)
      return h('svg', {
        class: getSpinnerClass(props.color, 'rings'),
        stroke: 'currentColor',
        width: cSize,
        height: cSize,
        viewBox: '0 0 45 45',
        xmlns: 'http://www.w3.org/2000/svg',
        innerHTML
      })
    }
  }
})
