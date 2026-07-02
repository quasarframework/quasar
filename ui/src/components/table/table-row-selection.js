import { computed } from 'vue'

export const useTableRowSelectionProps = {
  /**
   * Selection type
   *
   * @api prop selection
   * @type {String}
   * @default 'none'
   * @category selection
   */
  selection: {
    type: String,
    default: 'none',
    validator: v => ['single', 'multiple', 'none'].includes(v)
  },

  /**
   * Keeps the user selection array
   *
   * @api prop selected
   * @type {Array}
   * @category selection
   * @syncable
   */
  selected: {
    type: Array,
    default: () => []
  }
}

export const useTableRowSelectionEmits = [
  /**
   * Emitted when the selected rows change
   *
   * @api event update:selected
   * @param {Array} newSelected New selected rows
   */
  'update:selected',

  /**
   * Emitted when rows are selected/unselected
   *
   * @api event selection
   * @param {Object} details Selection details
   */
  'selection'
]

export function useTableRowSelection(props, emit, computedRows, getRowKey) {
  const selectedKeys = computed(() => {
    const keys = {}
    props.selected.map(getRowKey.value).forEach(key => {
      keys[key] = true
    })
    return keys
  })

  const hasSelectionMode = computed(() => props.selection !== 'none')
  const singleSelection = computed(() => props.selection === 'single')
  const multipleSelection = computed(() => props.selection === 'multiple')
  const allRowsSelected = computed(
    () =>
      computedRows.value.length !== 0 &&
      computedRows.value.every(row => selectedKeys.value[getRowKey.value(row)])
  )

  const someRowsSelected = computed(
    () =>
      !allRowsSelected.value &&
      computedRows.value.some(row => selectedKeys.value[getRowKey.value(row)])
  )

  const rowsSelectedNumber = computed(() => props.selected.length)

  /**
   * Determine if a row key is selected
   *
   * @api method isRowSelected
   * @param {Any} key Row key
   * @returns {Boolean} Is row selected
   */
  function isRowSelected(key) {
    return selectedKeys.value[key] === true
  }

  /**
   * Clears user selection
   *
   * @api method clearSelection
   */
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
