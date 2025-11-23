import { ref, computed, onBeforeUnmount } from 'vue'

export const useTableColumnResizeProps = {
  resizableColumns: Boolean,
  columnWidths: Object
}

export const useTableColumnResizeEmits = [ 'columnResize' ]

export function useTableColumnResize (props, computedCols, emit) {
  const columnWidths = ref(props.columnWidths || {})
  const resizing = ref(null)

  if (props.columnWidths) {
    columnWidths.value = { ...props.columnWidths }
  }

  let startX = 0
  let startWidth = 0
  let currentCol = null

  function onMouseMove (evt) {
    if (!resizing.value || !currentCol) return

    evt.preventDefault()

    const diff = evt.clientX - startX
    const newWidth = Math.max(
      currentCol.minWidth || 50,
      startWidth + diff
    )

    const finalWidth = currentCol.maxWidth
      ? Math.min(newWidth, currentCol.maxWidth)
      : newWidth

    columnWidths.value = {
      ...columnWidths.value,
      [ currentCol.name ]: finalWidth
    }
  }

  function onMouseUp (evt) {
    if (!resizing.value || !currentCol) return

    evt.preventDefault()

    emit('columnResize', {
      col: currentCol,
      width: columnWidths.value[ currentCol.name ],
      widths: { ...columnWidths.value }
    })

    resizing.value = null
    currentCol = null
    document.body.style.cursor = ''

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  function startResize (evt, col) {
    if (!props.resizableColumns) return

    evt.preventDefault()
    evt.stopPropagation()

    const th = evt.target.closest('th')
    if (!th) return

    startX = evt.clientX
    startWidth = columnWidths.value[ col.name ] || th.offsetWidth
    currentCol = col
    resizing.value = col.name

    document.body.style.cursor = 'col-resize'

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onDoubleClick (col) {
    const newWidths = { ...columnWidths.value }
    delete newWidths[ col.name ]
    columnWidths.value = newWidths

    emit('columnResize', {
      col,
      width: 'auto',
      widths: { ...columnWidths.value }
    })
  }

  const colsWithWidths = computed(() => {
    if (!computedCols.value) return []
    if (!props.resizableColumns) return computedCols.value

    return computedCols.value.map(col => {
      const width = columnWidths.value[ col.name ]
      if (!width) return col

      const headerStyle = col.headerStyle
        ? `${ col.headerStyle }; width: ${ width }px`
        : `width: ${ width }px`

      const style = typeof col.style === 'string'
        ? `${ col.style }; width: ${ width }px`
        : (typeof col.style === 'function'
            ? row => `${ col.style(row) }; width: ${ width }px`
            : `width: ${ width }px`)

      return {
        ...col,
        headerStyle,
        style,
        __width: width
      }
    })
  })

  const colsMapWithWidths = computed(() => {
    const map = {}
    colsWithWidths.value.forEach(col => {
      map[ col.name ] = col
    })
    return map
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
  })

  return {
    columnWidths,
    resizing,
    colsWithWidths,
    colsMapWithWidths,
    startResize,
    onDoubleClick
  }
}
