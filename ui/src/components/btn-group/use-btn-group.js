import { computed } from 'vue'

const btnGroupDesignOptions = [
  'unelevated',
  'outline',
  'flat',
  'rounded',
  'square',
  'push',
  'stretch',
  'glossy'
]

export const useBtnGroupProps = {
  /**
   * Remove shadow
   *
   * @api prop unelevated
   * @type {Boolean}
   * @category style
   */
  unelevated: Boolean,

  /**
   * Use 'outline' design for buttons
   *
   * @api prop outline
   * @type {Boolean}
   * @category style
   */
  outline: Boolean,

  /**
   * Use 'flat' design for buttons
   *
   * @api prop flat
   * @extends flat
   */
  flat: Boolean,

  /**
   * Applies a more prominent border-radius for buttons
   *
   * @api prop rounded
   * @extends rounded
   */
  rounded: Boolean,

  /**
   * Removes border-radius so borders are squared
   *
   * @api prop square
   * @extends square
   */
  square: Boolean,

  /**
   * Use 'push' design for buttons
   *
   * @api prop push
   * @type {Boolean}
   * @category style
   */
  push: Boolean,

  /**
   * Stretch buttons to the group's height
   *
   * @api prop stretch
   * @type {Boolean}
   * @category style
   */
  stretch: Boolean,

  /**
   * Applies a glossy effect
   *
   * @api prop glossy
   * @type {Boolean}
   * @category style
   */
  glossy: Boolean,

  /**
   * Spread buttons horizontally to use all available space
   *
   * @api prop spread
   * @type {Boolean}
   * @category content
   */
  spread: Boolean
}

export default function useBtnGroup(props) {
  const classes = computed(() => {
    const cls = btnGroupDesignOptions
      .filter(t => props[t])
      .map(t => `q-btn-group--${t}`)
      .join(' ')

    return (
      `q-btn-group row no-wrap${cls.length !== 0 ? ' ' + cls : ''}` +
      (props.spread ? ' q-btn-group--spread' : ' inline')
    )
  })

  return {
    classes
  }
}
