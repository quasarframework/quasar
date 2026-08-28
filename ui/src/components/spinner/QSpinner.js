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
          class: getSpinnerClass(props.color, 'mat'),
          width: cSize,
          height: cSize,
          viewBox: '0 0 50 50'
        },
        [
          h('circle', {
            class: 'path',
            cx: '25',
            cy: '25',
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
