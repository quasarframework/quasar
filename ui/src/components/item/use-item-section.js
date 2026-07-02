import { computed } from 'vue'

export const useItemSectionProps = {
  /**
   * Render an avatar item side (does not needs 'side' prop to be set)
   *
   * @api prop avatar
   * @type {Boolean}
   * @category content
   */
  avatar: Boolean,

  /**
   * Render a thumbnail item side (does not needs 'side' prop to be set)
   *
   * @api prop thumbnail
   * @type {Boolean}
   * @category content
   */
  thumbnail: Boolean,

  /**
   * Renders as a side of the item
   *
   * @api prop side
   * @type {Boolean}
   * @category content
   */
  side: Boolean,

  /**
   * Align content to top (useful for multi-line items)
   *
   * @api prop top
   * @type {Boolean}
   * @category content
   */
  top: Boolean,

  /**
   * Do not wrap text (useful for item's main content)
   *
   * @api prop no-wrap
   * @type {Boolean}
   * @category content
   */
  noWrap: Boolean
}

export default function useItemSection(props) {
  const classes = computed(
    () =>
      'q-item__section column' +
      ` q-item__section--${props.avatar || props.side || props.thumbnail ? 'side' : 'main'}` +
      (props.top ? ' q-item__section--top justify-start' : ' justify-center') +
      (props.avatar ? ' q-item__section--avatar' : '') +
      (props.thumbnail ? ' q-item__section--thumbnail' : '') +
      (props.noWrap ? ' q-item__section--nowrap' : '')
  )

  return {
    classes
  }
}
