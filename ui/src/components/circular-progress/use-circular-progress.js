import { useSizeProps } from '../../composables/private/use-size.js'

// also used by QKnob
export const useCircularCommonProps = {
  ...useSizeProps,

  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },

  color: String,
  centerColor: String,
  trackColor: String,

  fontSize: String,
  rounded: Boolean,

  // ratio
  thickness: {
    type: Number,
    default: 0.2,
    validator: v => v >= 0 && v <= 1
  },

  angle: {
    type: Number,
    default: 0
  },

  showValue: Boolean,
  reverse: Boolean,

  instantFeedback: Boolean
}
