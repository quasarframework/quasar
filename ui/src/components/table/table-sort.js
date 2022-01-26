import { computed } from 'vue'

import { sortDate } from '../../utils/private/sort.js'
import { isNumber, isDate } from '../../utils/private/is.js'

export const useTableSortProps = {
  sortMethod: Function,
  binaryStateSort: Boolean,
  columnSortOrder: {
    type: String,
    validator: v => v === 'ad' || v === 'da',
    default: 'ad'
  }
}

export function useTableSort (props, computedPagination, colList, setPagination) {
  const columnToSort = computed(() => {
    const { sortBy } = computedPagination.value

    return sortBy
      ? colList.value.find(def => def.name === sortBy) || null
      : null
  })

  const computedSortMethod = computed(() => (
    props.sortMethod !== void 0
      ? props.sortMethod
      : (data, sortBy, descending) => {
          const col = colList.value.find(def => def.name === sortBy)
          if (col === void 0 || col.field === void 0) {
            return data
          }

          const
            dir = descending === true ? -1 : 1,
            val = typeof col.field === 'function'
              ? v => col.field(v)
              : v => v[ col.field ]

          return data.sort((a, b) => {
            let
              A = val(a),
              B = val(b)

            if (A === null || A === void 0) {
              return -1 * dir
            }
            if (B === null || B === void 0) {
              return 1 * dir
            }
            if (col.sort !== void 0) {
              return col.sort(A, B, a, b) * dir
            }
            if (isNumber(A) === true && isNumber(B) === true) {
              return (A - B) * dir
            }
            if (isDate(A) === true && isDate(B) === true) {
              return sortDate(A, B) * dir
            }
            if (typeof A === 'boolean' && typeof B === 'boolean') {
              return (A - B) * dir
            }

            [ A, B ] = [ A, B ].map(s => (s + '').toLocaleString().toLowerCase())

            return A < B
              ? -1 * dir
              : (A === B ? 0 : dir)
          })
        }
  ))

  function sort (col /* String(col name) or Object(col definition) */) {
    let sortOrder = props.columnSortOrder

    if (col === Object(col)) {
      if (col.sortOrder) {
        sortOrder = col.sortOrder
      }

      col = col.name
    }
    else {
      const def = colList.value.find(def => def.name === col)
      if (def !== void 0 && def.sortOrder) {
        sortOrder = def.sortOrder
      }
    }

    let { sortBy, descending } = computedPagination.value

    if (sortBy !== col) {
      sortBy = col
      descending = sortOrder === 'da'
    }
    else if (props.binaryStateSort === true) {
      descending = !descending
    }
    else if (descending === true) {
      if (sortOrder === 'ad') {
        sortBy = null
      }
      else {
        descending = false
      }
    }
    else { // ascending
      if (sortOrder === 'ad') {
        descending = true
      }
      else {
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
