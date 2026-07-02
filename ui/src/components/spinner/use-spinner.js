import { computed } from 'vue'
import { useSizeDefaults } from '../../composables/private.use-size/use-size.js'

export const useSpinnerProps = {
  /**
   * Size in CSS units, including unit name or standard size name (xs|sm|md|lg|xl)
   *
   * @api prop size
   * @type {String|Number}
   * @default '1em'
   * @category style
   * @example '16px'
   * @example '2rem'
   * @example 'xs'
   * @example 24
   */
  size: {
    type: [String, Number],
    default: '1em'
  },

  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @extends color
   */
  color: String
}

export default function useSpinner(props) {
  return {
    cSize: computed(() =>
      props.size in useSizeDefaults
        ? `${useSizeDefaults[props.size]}px`
        : props.size
    ),

    classes: computed(
      () => 'q-spinner' + (props.color ? ` text-${props.color}` : '')
    )
  }
}
