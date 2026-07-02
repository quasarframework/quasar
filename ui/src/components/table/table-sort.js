import { computed } from 'vue'

import { sortDate } from '../../utils/private.sort/sort.js'
import { isDate, isNumber, isObject } from '../../utils/is/is.js'

export const useTableSortProps = {
  /**
   * The actual sort mechanism; Function (rows, sortBy, descending) => sorted rows; For best performance, reference it from your scope and do not define it inline
   *
   * @api prop sort-method
   * @type {Function}
   * @category sorting
   */
  sortMethod: Function,

  /**
   * Skip the third state (unsorted) when user toggles column sort direction
   *
   * @api prop binary-state-sort
   * @type {Boolean}
   * @category sorting
   */
  binaryStateSort: Boolean,

  /**
   * Default sort order for each column
   *
   * @api prop column-sort-order
   * @type {String}
   * @default 'ad'
   * @category sorting
   */
  columnSortOrder: {
    type: String,
    validator: v => v === 'ad' || v === 'da',
    default: 'ad'
  }
}

export function useTableSort(
  props,
  computedPagination,
  colList,
  setPagination
) {
  const columnToSort = computed(() => {
    const { sortBy } = computedPagination.value

    return sortBy
      ? colList.value.find(def => def.name === sortBy) || null
      : null
  })

  const computedSortMethod = computed(() =>
    props.sortMethod !== void 0
      ? props.sortMethod
      : (data, sortBy, descending) => {
          const col = colList.value.find(def => def.name === sortBy)
          if (col === void 0 || col.field === void 0) {
            return data
          }

          const dir = descending ? -1 : 1,
            val =
              typeof col.field === 'function'
                ? v => col.field(v)
                : v => v[col.field]

          return data.sort((a, b) => {
            let A = val(a),
              B = val(b)

            if (col.rawSort !== void 0) {
              return col.rawSort(A, B, a, b) * dir
            }
            if (A === null || A === void 0) {
              return -1 * dir
            }
            if (B === null || B === void 0) {
              return Number(dir)
            }
            if (col.sort !== void 0) {
              // gets called without rows that have null/undefined as value
              // due to the above two statements
              return col.sort(A, B, a, b) * dir
            }
            if (isNumber(A) && isNumber(B)) {
              return (A - B) * dir
            }
            if (isDate(A) && isDate(B)) {
              return sortDate(A, B) * dir
            }
            if (typeof A === 'boolean' && typeof B === 'boolean') {
              return (A - B) * dir
            }

            ;[A, B] = [A, B].map(s => String(s).toLocaleString().toLowerCase())

            return A < B ? -1 * dir : A === B ? 0 : dir
          })
        }
  )

  /**
   * Sort rows by column
   *
   * @api method sort
   * @param {String|Object} col String column name or column definition Object
   */
  function sort(col /* String(col name) or Object(col definition) */) {
    let sortOrder = props.columnSortOrder

    if (isObject(col)) {
      if (col.sortOrder) {
        sortOrder = col.sortOrder
      }

      col = col.name
    } else {
      const def = colList.value.find(item => item.name === col)
      if (def?.sortOrder) {
        sortOrder = def.sortOrder
      }
    }

    let { sortBy, descending } = computedPagination.value

    if (sortBy !== col) {
      sortBy = col
      descending = sortOrder === 'da'
    } else if (props.binaryStateSort) {
      descending = !descending
    } else if (descending) {
      if (sortOrder === 'ad') {
        sortBy = null
      } else {
        descending = false
      }
    } else {
      // ascending
      if (sortOrder === 'ad') {
        descending = true
      } else {
        sortBy = null
      }
    }

    setPagination({ sortBy, descending, page: 1 })
  }

  return {
    columnToSort,
    computedSortMethod,
    sort
  }
}
