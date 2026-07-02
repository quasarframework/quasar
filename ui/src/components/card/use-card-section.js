import { computed } from 'vue'

export const useCardSectionProps = {
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
   * Display a horizontal section (will have no padding and can contain other QCardSection)
   *
   * @api prop horizontal
   * @type {Boolean}
   * @category content
   */
  horizontal: Boolean
}

export default function useCardSection(props) {
  const classes = computed(
    () =>
      'q-card__section' +
      ` q-card__section--${props.horizontal ? 'horiz row no-wrap' : 'vert'}`
  )

  return {
    classes
  }
}
