import { computed } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

export const useBannerProps = {
  ...useDarkProps,

  /**
   * Display actions on same row as content
   *
   * @api prop inline-actions
   * @type {Boolean}
   * @category content
   */
  inlineActions: Boolean,

  /**
   * Dense mode; occupies less space
   *
   * @api prop dense
   * @type {Boolean}
   * @category style
   */
  dense: Boolean,

  /**
   * Applies a small standard border-radius for a squared shape of the component
   *
   * @api prop rounded
   * @extends rounded
   */
  rounded: Boolean
}

export default function useBanner(props, $q) {
  const isDark = useDark(props, $q)

  const classes = computed(
    () =>
      'q-banner row items-center' +
      (props.dense ? ' q-banner--dense' : '') +
      (isDark.value ? ' q-banner--dark q-dark' : '') +
      (props.rounded ? ' rounded-borders' : '')
  )

  const actionClass = computed(
    () =>
      'q-banner__actions row items-center justify-end' +
      ` col-${props.inlineActions ? 'auto' : 'all'}`
  )

  return {
    classes,
    actionClass
  }
}
