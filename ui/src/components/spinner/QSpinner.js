import { h } from 'vue'

import {
  getSpinnerClass,
  getSpinnerSize,
  useSpinnerProps
} from './spinner-utils.js'

import { createComponent } from '../../utils/private.create/create.js'

export default /*#__PURE__*/ createComponent({
  name: 'QSpinner',

  props: {
    ...useSpinnerProps,

    thickness: {
      type: Number,
      default: 5
    }
  },

  setup(props) {
    return () => {
      const cSize = getSpinnerSize(props.size)
      return h(
        'svg',
        {
          class: getSpinnerClass(props.color) + ' q-spinner-mat',
          width: cSize,
          height: cSize,
          viewBox: '25 25 50 50'
        },
        [
          h('circle', {
            class: 'path',
            cx: '50',
            cy: '50',
            r: '20',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': props.thickness,
            'stroke-miterlimit': '10'
          })
        ]
      )
    }
  }
})
