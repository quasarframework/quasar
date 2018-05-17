export default {
  props: {
    filter: String,
    filterMethod: {
      type: Function,
      default (rows, terms, cols = this.computedCols, cellValue = this.getCellValue) {
        const lowerTerms = terms ? terms.toLowerCase() : ''
        return rows.filter(
          row => cols.some(col => (cellValue(col, row) + '').toLowerCase().indexOf(lowerTerms) !== -1)
        )
      }
    }
  },
  computed: {
    hasFilter () {
      return this.filter !== void 0 && this.filter.length > 0
    }
  },
  watch: {
    filter () {
      this.$nextTick(() => {
        this.setPagination({ page: 1 }, true)
      })
    }
  }
}
