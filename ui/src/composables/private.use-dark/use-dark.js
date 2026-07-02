import { computed } from 'vue'

export const useDarkProps = {
  /**
   * Notify the component that the background is a dark color
   *
   * @api prop dark
   * @type {Boolean|null}
   * @default null
   * @category style
   * @optional
   */
  dark: {
    type: Boolean,
    default: null
  }
}

export default function useDark(props, $q) {
  // return isDark
  return computed(() => (props.dark === null ? $q.dark.isActive : props.dark))
}
