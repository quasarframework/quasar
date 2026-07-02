import { computed } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

const separatorValues = ['horizontal', 'vertical', 'cell', 'none']

export const useMarkupTableProps = {
  ...useDarkProps,

  /**
   * Dense mode; occupies less space
   *
   * @api prop dense
   * @extends dense
   */
  dense: Boolean,

  /**
   * Applies a 'flat' design (no default shadow)
   *
   * @api prop flat
   * @extends flat
   */
  flat: Boolean,

  /**
   * Applies a default border to the component
   *
   * @api prop bordered
   * @extends bordered
   */
  bordered: Boolean,

  /**
   * Removes border-radius so borders are squared
   *
   * @api prop square
   * @extends square
   */
  square: Boolean,

  /**
   * Wrap text within table cells
   *
   * @api prop wrap-cells
   * @type {Boolean}
   * @category content
   */
  wrapCells: Boolean,

  /**
   * Use a separator/border between rows, columns or all cells
   *
   * @api prop separator
   * @type {String}
   * @default 'horizontal'
   * @category content
   * @value 'horizontal'
   * @value 'vertical'
   * @value 'cell'
   * @value 'none'
   * @example 'cell'
   */
  separator: {
    type: String,
    default: 'horizontal',
    validator: v => separatorValues.includes(v)
  }
}

export default function useMarkupTable(props, $q) {
  const isDark = useDark(props, $q)

  const classes = computed(
    () =>
      'q-markup-table q-table__container q-table__card' +
      ` q-table--${props.separator}-separator` +
      (isDark.value ? ' q-table--dark q-table__card--dark q-dark' : '') +
      (props.dense ? ' q-table--dense' : '') +
      (props.flat ? ' q-table--flat' : '') +
      (props.bordered ? ' q-table--bordered' : '') +
      (props.square ? ' q-table--square' : '') +
      (props.wrapCells ? '' : ' q-table--no-wrap')
  )

  return {
    classes
  }
}
