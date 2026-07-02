import { computed } from 'vue'

export const useItemLabelProps = {
  /**
   * Renders an overline label
   *
   * @api prop overline
   * @type {Boolean}
   * @category content
   */
  overline: Boolean,

  /**
   * Renders a caption label
   *
   * @api prop caption
   * @type {Boolean}
   * @category content
   */
  caption: Boolean,

  /**
   * Renders a header label
   *
   * @api prop header
   * @type {Boolean}
   * @category content
   */
  header: Boolean,

  /**
   * Apply ellipsis when there's not enough space to render on the specified number of lines
   *
   * @api prop lines
   * @type {Number|String}
   * @category content|behavior
   */
  lines: [Number, String]
}

export default function useItemLabel(props) {
  const parsedLines = computed(() => Number.parseInt(props.lines, 10))

  const classes = computed(
    () =>
      'q-item__label' +
      (props.overline ? ' q-item__label--overline text-overline' : '') +
      (props.caption ? ' q-item__label--caption text-caption' : '') +
      (props.header ? ' q-item__label--header' : '') +
      (parsedLines.value === 1 ? ' ellipsis' : '')
  )

  const style = computed(() =>
    props.lines !== void 0 && parsedLines.value > 1
      ? {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': parsedLines.value
        }
      : null
  )

  return {
    classes,
    style
  }
}
