import { computed } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

const roleAttrExceptions = ['ul', 'ol']

export const useListProps = {
  ...useDarkProps,

  /**
   * Applies a default border to the component
   *
   * @api prop bordered
   * @extends bordered
   */
  bordered: Boolean,

  /**
   * Dense mode; occupies less space
   *
   * @api prop dense
   * @extends dense
   */
  dense: Boolean,

  /**
   * Applies a separator between contained items
   *
   * @api prop separator
   * @type {Boolean}
   * @category content
   */
  separator: Boolean,

  /**
   * Applies a material-like padding on top and bottom
   *
   * @api prop padding
   * @type {Boolean}
   * @category style
   */
  padding: Boolean,

  /**
   * HTML tag to use
   *
   * @api prop tag
   * @type {String}
   * @default 'div'
   * @category content
   * @example 'div'
   * @example 'ul'
   * @example 'ol'
   */
  tag: {
    type: String,
    default: 'div'
  }
}

export default function useList(props, $q) {
  const isDark = useDark(props, $q)

  const role = computed(() =>
    roleAttrExceptions.includes(props.tag) ? null : 'list'
  )

  const classes = computed(
    () =>
      'q-list' +
      (props.bordered ? ' q-list--bordered' : '') +
      (props.dense ? ' q-list--dense' : '') +
      (props.separator ? ' q-list--separator' : '') +
      (isDark.value ? ' q-list--dark' : '') +
      (props.padding ? ' q-list--padding' : '')
  )

  return {
    classes,
    role
  }
}
