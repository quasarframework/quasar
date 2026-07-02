import { computed } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

export const skeletonTypes = [
  'text',
  'rect',
  'circle',
  'QBtn',
  'QBadge',
  'QChip',
  'QToolbar',
  'QCheckbox',
  'QRadio',
  'QToggle',
  'QSlider',
  'QRange',
  'QInput',
  'QAvatar'
]

export const skeletonAnimations = [
  'wave',
  'pulse',
  'pulse-x',
  'pulse-y',
  'fade',
  'blink',
  'none'
]

export const useSkeletonProps = {
  ...useDarkProps,

  /**
   * HTML tag to use
   *
   * @api prop tag
   * @type {String}
   * @default 'div'
   * @category content
   * @example 'div'
   * @example 'span'
   */
  tag: {
    type: String,
    default: 'div'
  },

  /**
   * Type of skeleton placeholder
   *
   * @api prop type
   * @type {String}
   * @default 'rect'
   * @category content
   * @value 'text'
   * @value 'rect'
   * @value 'circle'
   * @value 'QBtn'
   * @value 'QBadge'
   * @value 'QChip'
   * @value 'QToolbar'
   * @value 'QCheckbox'
   * @value 'QRadio'
   * @value 'QToggle'
   * @value 'QSlider'
   * @value 'QRange'
   * @value 'QInput'
   * @value 'QAvatar'
   */
  type: {
    type: String,
    validator: v => skeletonTypes.includes(v),
    default: 'rect'
  },

  /**
   * Animation effect of the skeleton placeholder
   *
   * @api prop animation
   * @type {String}
   * @default 'wave'
   * @category style
   * @value 'wave'
   * @value 'pulse'
   * @value 'pulse-x'
   * @value 'pulse-y'
   * @value 'fade'
   * @value 'blink'
   * @value 'none'
   */
  animation: {
    type: String,
    validator: v => skeletonAnimations.includes(v),
    default: 'wave'
  },

  /**
   * Animation speed, in milliseconds
   *
   * @api prop animation-speed
   * @type {String|Number}
   * @default 1500
   * @category style
   * @example 1500
   * @example '1200'
   */
  animationSpeed: {
    type: [String, Number],
    default: 1500
  },

  /**
   * Removes border-radius so borders are squared
   *
   * @api prop square
   * @extends square
   */
  square: Boolean,

  /**
   * Applies a default border to the component
   *
   * @api prop bordered
   * @extends bordered
   */
  bordered: Boolean,

  /**
   * Size in CSS units, including unit name
   *
   * @api prop size
   * @type {String}
   * @category style
   * @example '50px'
   * @example '2rem'
   */
  size: String,

  /**
   * Width in CSS units, including unit name
   *
   * @api prop width
   * @type {String}
   * @category style
   * @example '50px'
   * @example '100%'
   */
  width: String,

  /**
   * Height in CSS units, including unit name
   *
   * @api prop height
   * @type {String}
   * @category style
   * @example '50px'
   * @example '2rem'
   */
  height: String
}

export default function useSkeleton(props, $q) {
  const isDark = useDark(props, $q)

  const style = computed(() => {
    const size =
      props.size !== void 0
        ? [props.size, props.size]
        : [props.width, props.height]

    return {
      '--q-skeleton-speed': `${props.animationSpeed}ms`,
      width: size[0],
      height: size[1]
    }
  })

  const classes = computed(
    () =>
      `q-skeleton q-skeleton--${isDark.value ? 'dark' : 'light'} q-skeleton--type-${props.type}` +
      (props.animation !== 'none'
        ? ` q-skeleton--anim q-skeleton--anim-${props.animation}`
        : '') +
      (props.square ? ' q-skeleton--square' : '') +
      (props.bordered ? ' q-skeleton--bordered' : '')
  )

  return {
    classes,
    style
  }
}
