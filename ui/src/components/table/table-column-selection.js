import { computed } from 'vue'

import { isNumber } from '../../utils/private/is.js'

export const useTableColumnSelectionProps = {
  visibleColumns: Array
}

export function useTableColumnSelection (props, computedPagination, hasSelectionMode) {
  const colList = computed(() => {
    if (props.columns !== void 0) {
      return props.columns
    }

    // we infer columns from first row
    const row = props.rows[ 0 ]

    return row !== void 0
      ? Object.keys(row).map(name => ({
          name,
          label: name.toUpperCase(),
          field: name,
          align: isNumber(row[ name ]) ? 'right' : 'left',
          sortable: true
        }))
      : []
  })

  const computedCols = computed(() => {
    const { sortBy, descending } = computedPagination.value

    const cols = props.visibleColumns !== void 0
      ? colList.value.filter(col => col.required === true || props.visibleColumns.includes(col.name) === true)
      : colList.value

    return cols.map(col => {
      const align = col.align || 'right'

      return {
        ...col,
        align,
        __iconClass: `q-table__sort-icon q-table__sort-icon--${ align }`,
        __thClass: `text-${ align }`
          + (col.headerClasses !== void 0 ? ' ' + col.headerClasses : '')
          + (col.sortable === true ? ' sortable' : '')
          + (col.name === sortBy ? ` sorted ${ descending === true ? 'sort-desc' : '' }` : ''),
        __tdClass: `text-${ align }${ col.classes !== void 0 ? ' ' + col.classes : '' }`
      }
    })
  })

  const computedColsMap = computed(() => {
    const names = {}
    computedCols.value.forEach(col => {
      names[ col.name ] = col
    })
    return names
  })

  const computedColspan = computed(() => {
    return props.tableColspan !== void 0
      ? props.tableColspan
      : computedCols.value.length + (hasSelectionMode.value === true ? 1 : 0)
  })

  return {
    colList,
    computedCols,
    computedColsMap,
    computedColspan
  }
}
