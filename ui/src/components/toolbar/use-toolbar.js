import { computed } from 'vue'

export const useToolbarProps = {
  /**
   * Apply an inset to content
   *
   * @api prop inset
   * @type {Boolean}
   * @category style
   */
  inset: Boolean
}

export default function useToolbar(props) {
  const classes = computed(
    () =>
      'q-toolbar row no-wrap items-center' +
      (props.inset ? ' q-toolbar--inset' : '')
  )

  return {
    classes
  }
}
