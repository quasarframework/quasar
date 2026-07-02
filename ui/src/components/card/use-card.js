import { computed } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

export const useCardProps = {
  ...useDarkProps,

  /**
   * HTML tag to use
   *
   * @api prop tag
   * @type {String}
   * @default 'div'
   * @category content
   * @optional
   * @example 'div'
   * @example 'form'
   */
  tag: {
    type: String,
    default: 'div'
  },

  /**
   * Removes border-radius so borders are squared
   *
   * @api prop square
   * @type {Boolean}
   * @category style
   */
  square: Boolean,

  /**
   * Applies a 'flat' design (no default shadow)
   *
   * @api prop flat
   * @type {Boolean}
   * @category style
   */
  flat: Boolean,

  /**
   * Applies a default border to the component
   *
   * @api prop bordered
   * @type {Boolean}
   * @category style
   */
  bordered: Boolean
}

export default function useCard(props, $q) {
  const isDark = useDark(props, $q)

  const classes = computed(
    () =>
      'q-card' +
      (isDark.value ? ' q-card--dark q-dark' : '') +
      (props.bordered ? ' q-card--bordered' : '') +
      (props.square ? ' q-card--square no-border-radius' : '') +
      (props.flat ? ' q-card--flat no-shadow' : '')
  )

  return {
    classes
  }
}
