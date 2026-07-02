import { computed } from 'vue'

export const useToolbarTitleProps = {
  /**
   * By default, QToolbarTitle is set to grow to the available space. However, you can reverse that with this prop
   *
   * @api prop shrink
   * @type {Boolean}
   * @category style
   */
  shrink: Boolean
}

export default function useToolbarTitle(props) {
  const classes = computed(
    () => 'q-toolbar__title ellipsis' + (props.shrink ? ' col-shrink' : '')
  )

  return {
    classes
  }
}
