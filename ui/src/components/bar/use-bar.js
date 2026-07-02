import { computed } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

export const useBarProps = {
  ...useDarkProps,

  /**
   * Dense mode; occupies less space
   *
   * @api prop dense
   * @type {Boolean}
   * @category style
   */
  dense: Boolean
}

export default function useBar(props, $q) {
  const isDark = useDark(props, $q)

  const classes = computed(
    () =>
      'q-bar row no-wrap items-center' +
      ` q-bar--${props.dense ? 'dense' : 'standard'} ` +
      ` q-bar--${isDark.value ? 'dark' : 'light'}`
  )

  return {
    classes
  }
}
