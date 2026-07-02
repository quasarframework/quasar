import { computed } from 'vue'

import useAlign, {
  useAlignProps
} from '../../composables/private.use-align/use-align.js'

export const useCardActionsProps = {
  ...useAlignProps,

  /**
   * Display actions one below the other
   *
   * @api prop vertical
   * @type {Boolean}
   * @category content
   */
  vertical: Boolean
}

export default function useCardActions(props) {
  const alignClass = useAlign(props)

  const classes = computed(
    () =>
      `q-card__actions ${alignClass.value}` +
      ` q-card__actions--${props.vertical ? 'vert column' : 'horiz row'}`
  )

  return {
    classes
  }
}
