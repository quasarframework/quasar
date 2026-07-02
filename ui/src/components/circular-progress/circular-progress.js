import { useSizeProps } from '../../composables/private.use-size/use-size.js'

// also used by QKnob
export const useCircularCommonProps = {
  ...useSizeProps,

  /**
   * Minimum value defining 'no progress' (must be lower than 'max')
   *
   * @api prop min
   * @type {Number}
   * @default 0
   * @category model
   */
  min: {
    type: Number,
    default: 0
  },

  /**
   * Maximum value defining 100% progress made (must be higher than 'min')
   *
   * @api prop max
   * @type {Number}
   * @default 100
   * @category model
   */
  max: {
    type: Number,
    default: 100
  },

  /**
   * Color name for the arc progress from the Quasar Color Palette
   *
   * @api prop color
   * @extends color
   */
  color: String,

  /**
   * Color name for the center part of the component from the Quasar Color Palette
   *
   * @api prop center-color
   * @extends color
   */
  centerColor: String,

  /**
   * Color name for the track of the component from the Quasar Color Palette
   *
   * @api prop track-color
   * @extends color
   */
  trackColor: String,

  /**
   * Size of text in CSS units, including unit name. Suggestion: use 'em' units to sync with component size
   *
   * @api prop font-size
   * @type {String}
   * @category style
   * @example '1em'
   * @example '16px'
   * @example '2rem'
   */
  fontSize: String,

  /**
   * Rounding the arc of progress
   *
   * @api prop rounded
   * @type {Boolean}
   * @category style
   * @addedIn v2.8.4
   */
  rounded: Boolean,

  // ratio
  /**
   * Thickness of progress arc as a ratio (0.0 < x < 1.0) of component size
   *
   * @api prop thickness
   * @type {Number}
   * @default 0.2
   * @category style
   */
  thickness: {
    type: Number,
    default: 0.2,
    validator: v => v >= 0 && v <= 1
  },

  /**
   * Angle to rotate progress arc by
   *
   * @api prop angle
   * @type {Number}
   * @default 0
   * @category content
   */
  angle: {
    type: Number,
    default: 0
  },

  /**
   * Enables the default slot and uses it (if available), otherwise it displays the 'value' prop as text; Make sure the text has enough space to be displayed inside the component
   *
   * @api prop show-value
   * @type {Boolean}
   * @category content|behavior
   */
  showValue: Boolean,

  /**
   * Reverses the direction of progress; Only for determined state
   *
   * @api prop reverse
   * @type {Boolean}
   * @category behavior
   */
  reverse: Boolean,

  /**
   * No animation when model changes
   *
   * @api prop instant-feedback
   * @type {Boolean}
   * @category behavior
   */
  instantFeedback: Boolean
}
