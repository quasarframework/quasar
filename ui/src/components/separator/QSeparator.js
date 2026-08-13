import { h } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'

const insetMap = {
  true: 'inset',
  item: 'item-inset',
  'item-thumbnail': 'item-thumbnail-inset'
}

export const margins = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24
}

export default /*#__PURE__*/ createComponent({
  name: 'QSeparator',

  props: {
    ...useDarkProps,

    spaced: [Boolean, String],
    inset: [Boolean, String],
    vertical: Boolean,
    color: String,
    size: String
  },

  setup(props) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    return () => {
      const orientation = props.vertical ? 'vertical' : 'horizontal'
      const orientClass = ` q-separator--${orientation}`

      const style = {}

      if (props.size !== void 0) {
        style[props.vertical ? 'width' : 'height'] = props.size
      }

      if (props.spaced) {
        const size =
          props.spaced === true
            ? `${margins.md}px`
            : props.spaced in margins
              ? `${margins[props.spaced]}px`
              : props.spaced

        const dir = props.vertical ? ['Left', 'Right'] : ['Top', 'Bottom']

        style[`margin${dir[0]}`] = style[`margin${dir[1]}`] = size
      }

      return h('hr', {
        class:
          `q-separator${orientClass}` +
          (props.inset ? `${orientClass}-${insetMap[props.inset]}` : '') +
          (props.color !== void 0 ? ` bg-${props.color}` : '') +
          (isDark() ? ' q-separator--dark' : ''),
        style,
        'aria-orientation': orientation
      })
    }
  }
})
