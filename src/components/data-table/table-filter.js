export default {
  props: {
    filter: String,
    filterMethod: {
      type: Function,
      default (rows, terms, cols = this.computedColumns, cellValue = this.getCellValue) {
        return rows.filter(
          row => cols.some(col => (cellValue(col, row) + '').toLowerCase().indexOf(terms) !== -1)
        )
      }
    }
  },
  computed: {
    hasFilter () {
      return this.filter !== void 0
    }
  },
  watch: {
    filter () {
      this.$nextTick(() => {
        this.setPagination({ page: 1 })
      })
    }
  }
}
