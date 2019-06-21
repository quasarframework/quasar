export default {
  props: {
    visibleColumns: Array
  },

  computed: {
    computedCols () {
      let { sortBy, descending } = this.computedPagination

      const cols = this.visibleColumns !== void 0
        ? this.columns.filter(col => col.required === true || this.visibleColumns.includes(col.name) === true)
        : this.columns

      return cols.map(col => {
        col.align = col.align || 'right'
        col.__iconClass = `q-table__sort-icon q-table__sort-icon--${col.align}`
        col.__thClass = `text-${col.align}${col.sortable ? ' sortable' : ''}${col.name === sortBy ? ` sorted ${descending ? 'sort-desc' : ''}` : ''}`
        col.__tdClass = `text-${col.align}`
        return col
      })
    },

    computedColsMap () {
      const names = {}
      this.computedCols.forEach(col => {
        names[col.name] = col
      })
      return names
    }
  }
}
