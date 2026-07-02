import { computed, nextTick, watch } from 'vue'

export const useTableFilterProps = {
  /**
   * Filter String/Object
   *
   * @api prop filter
   * @type {String|Object}
   * @category filtering
   * @example 'car'
   */
  filter: [String, Object],

  /**
   * The actual filtering mechanism; For best performance, reference it from your scope and do not define it inline
   *
   * @api prop filter-method
   * @type {Function}
   * @category filtering
   */
  filterMethod: Function
}

export function useTableFilter(props, setPagination) {
  const computedFilterMethod = computed(() =>
    props.filterMethod !== void 0
      ? props.filterMethod
      : (rows, terms, cols, cellValue) => {
          const lowerTerms = terms ? terms.toLowerCase() : ''
          return rows.filter(row =>
            cols.some(col => {
              const val = String(cellValue(col, row))
              const haystack =
                val === 'undefined' || val === 'null' ? '' : val.toLowerCase()
              return haystack.includes(lowerTerms)
            })
          )
        }
  )

  watch(
    () => props.filter,
    () => {
      nextTick(() => {
        setPagination({ page: 1 }, true)
      })
    },
    { deep: true }
  )

  return { computedFilterMethod }
}
