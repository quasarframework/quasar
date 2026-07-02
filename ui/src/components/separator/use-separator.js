import { computed } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

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

export const useSeparatorProps = {
  ...useDarkProps,

  /**
   * If set to true, the corresponding direction margins will be set to 8px; It can also be set to one of the predefined sizes or a CSS size in px, em, rem, etc.
   *
   * @api prop spaced
   * @type {Boolean|String}
   * @category style
   * @example true
   * @example 'md'
   * @example '10px'
   */
  spaced: [Boolean, String],

  /**
   * If set to true, the left and right margins will be set to 16px; It can also be set to one of the predefined inset modes
   *
   * @api prop inset
   * @type {Boolean|String}
   * @category style
   * @value true
   * @value 'item'
   * @value 'item-thumbnail'
   */
  inset: [Boolean, String],

  /**
   * If set to true, the separator will be vertical
   *
   * @api prop vertical
   * @type {Boolean}
   * @category content
   */
  vertical: Boolean,

  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @extends color
   */
  color: String,

  /**
   * Size in CSS units, including unit name
   *
   * @api prop size
   * @type {String}
   * @category style
   * @example '1px'
   * @example '2px'
   * @example '1rem'
   */
  size: String
}

export default function useSeparator(props, $q) {
  const isDark = useDark(props, $q)

  const orientation = computed(() =>
    props.vertical ? 'vertical' : 'horizontal'
  )

  const orientClass = computed(() => ` q-separator--${orientation.value}`)

  const insetClass = computed(() =>
    props.inset ? `${orientClass.value}-${insetMap[props.inset]}` : ''
  )

  const classes = computed(
    () =>
      `q-separator${orientClass.value}${insetClass.value}` +
      (props.color !== void 0 ? ` bg-${props.color}` : '') +
      (isDark.value ? ' q-separator--dark' : '')
  )

  const style = computed(() => {
    const acc = {}

    if (props.size !== void 0) {
      acc[props.vertical ? 'width' : 'height'] = props.size
    }

    if (props.spaced) {
      const size =
        props.spaced === true
          ? `${margins.md}px`
          : props.spaced in margins
            ? `${margins[props.spaced]}px`
            : props.spaced

      const dir = props.vertical ? ['Left', 'Right'] : ['Top', 'Bottom']

      acc[`margin${dir[0]}`] = acc[`margin${dir[1]}`] = size
    }

    return acc
  })

  return {
    classes,
    style,
    orientation
  }
}
