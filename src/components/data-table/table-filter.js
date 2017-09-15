export default {
  props: {
    filter: String,
    filterMethod: {
      type: Function,
      default (rows, cols, terms) {
        return rows.filter(
          row => cols.some(col => {
            const val = typeof col.field === 'function'
              ? col.field(row)
              : row[col.field]

            return (val + '').toLowerCase().indexOf(terms) > -1
          })
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
