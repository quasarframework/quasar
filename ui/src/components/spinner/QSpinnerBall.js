import { h } from 'vue'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'
import { createComponent } from '../../utils/private.create/create.js'

const innerHTML =
  '<g transform="translate(1 1)" stroke-width="2" fill="none" fill-rule="evenodd"><circle cx="5" cy="50" r="5"><animate attributeName="cy" begin="0s" dur="2.2s" values="50;5;50;50" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="cx" begin="0s" dur="2.2s" values="5;27;49;5" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="27" cy="5" r="5"><animate attributeName="cy" begin="0s" dur="2.2s" from="5" to="5" values="5;50;50;5" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="cx" begin="0s" dur="2.2s" from="27" to="27" values="27;49;5;27" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="49" cy="50" r="5"><animate attributeName="cy" begin="0s" dur="2.2s" values="50;50;5;50" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="cx" from="49" to="49" begin="0s" dur="2.2s" values="49;5;27;49" calcMode="linear" repeatCount="indefinite"></animate></circle></g>'

export default /*#__PURE__*/ createComponent({
  name: 'QSpinnerBall',

  props: useSpinnerProps,

  setup(props) {
    return () => {
      const cSize = getSpinnerSize(props.size)
      return h('svg', {
        class: getSpinnerClass(props.color),
        stroke: 'currentColor',
        width: cSize,
        height: cSize,
        viewBox: '0 0 57 57',
        xmlns: 'http://www.w3.org/2000/svg',
        innerHTML
      })
    }
  }
})
