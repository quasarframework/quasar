import { computed, watch, nextTick } from 'vue'

export const useTableFilterProps = {
  filter: [ String, Object ],
  filterMethod: Function
}

export function useTableFilter (props, setPagination) {
  const computedFilterMethod = computed(() => (
    props.filterMethod !== void 0
      ? props.filterMethod
      : (rows, terms, cols, cellValue) => {
          const lowerTerms = terms ? terms.toLowerCase() : ''
          return rows.filter(
            row => cols.some(col => {
              const val = cellValue(col, row) + ''
              const haystack = (val === 'undefined' || val === 'null') ? '' : val.toLowerCase()
              return haystack.indexOf(lowerTerms) !== -1
            })
          )
        }
  ))

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
