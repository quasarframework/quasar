export default {
  props: {
    pagination: Object,
    rowsPerPageOptions: {
      type: Array,
      default: () => [3, 5, 7, 10, 15, 20, 25, 50, 'All']
    }
  },
  data () {
    return {
      innerPagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 5
      }
    }
  },
  computed: {
    computedPagination () {
      return Object.assign({}, this.innerPagination, this.pagination)
    },
    firstRowIndex () {
      const { page, rowsPerPage } = this.computedPagination
      return (page - 1) * rowsPerPage
    },
    lastRowIndex () {
      const { page, rowsPerPage } = this.computedPagination
      return page * rowsPerPage
    },
    computedRowsPerPageOptions () {
      return this.rowsPerPageOptions.map(count => ({
        label: '' + count,
        value: typeof count === 'string' ? 0 : count
      }))
    }
  },
  methods: {
    setPagination (val) {
      const newPagination = Object.assign({}, this.computedPagination, val)

      if (this.isServerSide) {
        this.requestServerInteraction({
          pagination: newPagination
        })
        return
      }

      if (this.pagination) {
        this.$emit('update:pagination', newPagination)
      }
      else {
        this.innerPagination = newPagination
      }
    }
  }
}
