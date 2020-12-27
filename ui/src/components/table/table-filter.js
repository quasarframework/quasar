export default {
  props: {
    filter: [String, Object],
    filterMethod: {
      type: Function,
      default (rows, terms, cols = this.computedCols, cellValue = this.getCellValue) {
        const lowerTerms = terms ? terms.toLowerCase() : ''
        return rows.filter(
          row => cols.some(col => {
            const val = cellValue(col, row) + ''
            const haystack = (val === 'undefined' || val === 'null') ? '' : val.toLowerCase()
            return haystack.indexOf(lowerTerms) !== -1
          })
        )
      }
    }
  },

  watch: {
    filter: {
      handler () {
        this.$nextTick(() => {
          this.setPagination({ page: 1 }, true)
        })
      },
      deep: true
    }
  }
}
