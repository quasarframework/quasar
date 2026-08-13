import { h } from 'vue'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'
import { createComponent } from '../../utils/private.create/create.js'

const innerHTML =
  '<g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2"><circle cx="22" cy="22" r="6"><animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" begin="1.5s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-width" begin="1.5s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="6"><animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" begin="3s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-width" begin="3s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="8"><animate attributeName="r" begin="0s" dur="1.5s" values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite"></animate></circle></g>'

export default /*#__PURE__*/ createComponent({
  name: 'QSpinnerRings',

  props: useSpinnerProps,

  setup(props) {
    return () => {
      const cSize = getSpinnerSize(props.size)
      return h('svg', {
        class: getSpinnerClass(props.color),
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
