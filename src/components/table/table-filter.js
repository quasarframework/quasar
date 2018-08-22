export default {
  props: {
    filter: [String, Object],
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
  watch: {
    filter () {
      this.$nextTick(() => {
        this.setPagination({ page: 1 }, true)
      })
    }
  }
}
