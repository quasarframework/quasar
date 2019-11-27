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
        col.__thClass = `text-${col.align}${col.headerClasses !== void 0 ? ' ' + col.headerClasses : ''}${col.sortable === true ? ' sortable' : ''}${col.name === sortBy ? ` sorted ${descending === true ? 'sort-desc' : ''}` : ''}`
        col.__tdClass = `text-${col.align}${col.classes !== void 0 ? ' ' + col.classes : ''}`
        col.__thStyle = col.headerStyle !== void 0 ? col.headerStyle : null
        col.__tdStyle = col.style !== void 0 ? col.style : null
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
