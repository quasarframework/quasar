export default {
  props: {
    visibleColumns: Array
  },
  computed: {
    computedColumns () {
      let { sortBy, descending } = this.computedPagination

      const cols = this.visibleColumns
        ? this.columns.filter(col => col.required || this.visibleColumns.includes(col.name))
        : this.columns

      return cols.map(col => {
        col.align = col.align || 'right'
        col.__iconClass = `sort-icon sort-icon-${col.align}`
        col.__thClass = `text-${col.align}${col.sortable ? ' sortable' : ''}${col.name === sortBy ? ` sorted ${descending ? 'sort-desc' : ''}` : ''}`
        col.__tdClass = `text-${col.align}`
        return col
      })
    }
  }
}
