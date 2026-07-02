import { computed } from 'vue'

export const alignValues = ['top', 'middle', 'bottom']

export const useBadgeProps = {
  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @extends color
   */
  color: String,

  /**
   * Overrides text color, if needed; Color name from the Quasar Color Palette
   *
   * @api prop text-color
   * @extends text-color
   */
  textColor: String,

  /**
   * Tell QBadge if it should float to the top right side of the relative positioned parent element or not
   *
   * @api prop floating
   * @type {Boolean}
   * @category content
   */
  floating: Boolean,

  /**
   * Applies a 0.8 opacity; Useful especially for floating QBadge
   *
   * @api prop transparent
   * @type {Boolean}
   * @category style
   */
  transparent: Boolean,

  /**
   * Content can wrap to multiple lines
   *
   * @api prop multi-line
   * @type {Boolean}
   * @category content
   */
  multiLine: Boolean,

  /**
   * Use 'outline' design (colored text and borders only)
   *
   * @api prop outline
   * @type {Boolean}
   * @category style
   */
  outline: Boolean,

  /**
   * Makes a rounded shaped badge
   *
   * @api prop rounded
   * @type {Boolean}
   * @category style
   */
  rounded: Boolean,

  /**
   * Badge's content as string; overrides default slot if specified
   *
   * @api prop label
   * @type {String|Number}
   * @category content
   * @example 'John Doe'
   * @example 22
   */
  label: [Number, String],

  /**
   * Sets vertical-align CSS prop
   *
   * @api prop align
   * @type {String}
   * @category content
   * @value 'top'
   * @value 'middle'
   * @value 'bottom'
   */
  align: {
    type: String,
    validator: v => alignValues.includes(v)
  }
}

export default function useBadge(props) {
  const style = computed(() =>
    props.align !== void 0 ? { verticalAlign: props.align } : null
  )

  const classes = computed(() => {
    const text = props.outline
      ? props.color || props.textColor
      : props.textColor

    return (
      'q-badge flex inline items-center no-wrap' +
      ` q-badge--${props.multiLine ? 'multi' : 'single'}-line` +
      (props.outline
        ? ' q-badge--outline'
        : props.color !== void 0
          ? ` bg-${props.color}`
          : '') +
      (text !== void 0 ? ` text-${text}` : '') +
      (props.floating ? ' q-badge--floating' : '') +
      (props.rounded ? ' q-badge--rounded' : '') +
      (props.transparent ? ' q-badge--transparent' : '')
    )
  })

  return {
    classes,
    style
  }
}
