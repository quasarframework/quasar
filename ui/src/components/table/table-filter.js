export default {
  props: {
    filter: [ String, Object ],
    filterMethod: Function
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
  },

  computed: {
    computedFilterMethod () {
      return this.filterMethod !== void 0
        ? this.filterMethod
        : (rows, terms, cols, cellValue) => {
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
  }
}
