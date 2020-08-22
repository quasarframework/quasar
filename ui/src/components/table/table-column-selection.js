import { isNumber } from '../../utils/is.js'

export default {
  props: {
    visibleColumns: Array
  },

  computed: {
    colList () {
      if (this.columns !== void 0) {
        return this.columns
      }

      // we infer columns from first row
      const row = this.data[0]

      return row !== void 0
        ? Object.keys(row).map(name => ({
          name,
          label: name.toUpperCase(),
          field: name,
          align: isNumber(row[name]) ? 'right' : 'left',
          sortable: true
        }))
        : []
    },

    computedCols () {
      const { sortBy, descending } = this.computedPagination

      const cols = this.visibleColumns !== void 0
        ? this.colList.filter(col => col.required === true || this.visibleColumns.includes(col.name) === true)
        : this.colList

      return cols.map(col => {
        const align = col.align || 'right'

        return {
          ...col,
          align,
          __iconClass: `q-table__sort-icon q-table__sort-icon--${align}`,
          __thClass: `text-${align}` +
            (col.headerClasses !== void 0 ? ' ' + col.headerClasses : '') +
            (col.sortable === true ? ' sortable' : '') +
            (col.name === sortBy ? ` sorted ${descending === true ? 'sort-desc' : ''}` : ''),
          __tdClass: `text-${align}${col.classes !== void 0 ? ' ' + col.classes : ''}`
        }
      })
    },

    computedColsMap () {
      const names = {}
      this.computedCols.forEach(col => {
        names[col.name] = col
      })
      return names
    },

    computedColspan () {
      return this.tableColspan !== void 0
        ? this.tableColspan
        : this.computedCols.length + (this.hasSelectionMode === true ? 1 : 0)
    }
  }
}
