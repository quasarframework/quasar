import { computed } from 'vue'

export const useTableRowSelectionProps = {
  selection: {
    type: String,
    default: 'none',
    validator: v => [ 'single', 'multiple', 'none' ].includes(v)
  },
  selected: {
    type: Array,
    default: () => []
  }
}

export const useTableRowSelectionEmits = [ 'update:selected', 'selection' ]

export function useTableRowSelection (props, emit, computedRows, getRowKey) {
  const selectedKeys = computed(() => {
    const keys = {}
    props.selected.map(getRowKey.value).forEach(key => {
      keys[ key ] = true
    })
    return keys
  })

  const hasSelectionMode = computed(() => {
    return props.selection !== 'none'
  })

  const singleSelection = computed(() => {
    return props.selection === 'single'
  })

  const multipleSelection = computed(() => {
    return props.selection === 'multiple'
  })

  const allRowsSelected = computed(() =>
    computedRows.value.length !== 0 && computedRows.value.every(
      row => selectedKeys.value[ getRowKey.value(row) ] === true
    )
  )

  const someRowsSelected = computed(() =>
    allRowsSelected.value !== true
    && computedRows.value.some(row => selectedKeys.value[ getRowKey.value(row) ] === true)
  )

  const rowsSelectedNumber = computed(() => props.selected.length)

  function isRowSelected (key) {
    return selectedKeys.value[ key ] === true
  }

  function clearSelection () {
    emit('update:selected', [])
  }

  function updateSelection (keys, rows, added, evt) {
    emit('selection', { rows, added, keys, evt })

    const payload = singleSelection.value === true
      ? (added === true ? rows : [])
      : (
          added === true
            ? props.selected.concat(rows)
            : props.selected.filter(
              row => keys.includes(getRowKey.value(row)) === false
            )
        )

    emit('update:selected', payload)
  }

  return {
    hasSelectionMode,
    singleSelection,
    multipleSelection,
    allRowsSelected,
    someRowsSelected,
    rowsSelectedNumber,

    isRowSelected,
    clearSelection,
    updateSelection
  }
}
