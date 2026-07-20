import { computed } from 'vue'

export const useTableRowSelectionProps = {
  selection: {
    type: String,
    default: 'none',
    validator: v => ['single', 'multiple', 'none'].includes(v)
  },
  selected: {
    type: Array,
    default: () => []
  }
}

export const useTableRowSelectionEmits = ['update:selected', 'selection']

export function useTableRowSelection(props, emit, computedRows, getRowKey) {
  const selectedKeys = computed(
    () => new Set(props.selected.map(getRowKey.value))
  )

  const hasSelectionMode = computed(() => props.selection !== 'none')
  const singleSelection = computed(() => props.selection === 'single')
  const multipleSelection = computed(() => props.selection === 'multiple')
  const allRowsSelected = computed(
    () =>
      computedRows.value.length !== 0 &&
      computedRows.value.every(row =>
        selectedKeys.value.has(getRowKey.value(row))
      )
  )

  const someRowsSelected = computed(
    () =>
      !allRowsSelected.value &&
      computedRows.value.some(row =>
        selectedKeys.value.has(getRowKey.value(row))
      )
  )

  const rowsSelectedNumber = computed(() => props.selected.length)

  function isRowSelected(key) {
    return selectedKeys.value.has(key)
  }

  function clearSelection() {
    emit('update:selected', [])
  }

  function updateSelection(keys, rows, added, evt) {
    emit('selection', { rows, added, keys, evt })

    const payload = singleSelection.value
      ? added
        ? rows
        : []
      : added
        ? [...props.selected, ...rows]
        : props.selected.filter(row => !keys.includes(getRowKey.value(row)))

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
