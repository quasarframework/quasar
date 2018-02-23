import extend from '../../utils/extend'

export default {
  props: {
    pagination: Object,
    rowsPerPageOptions: {
      type: Array,
      default: () => [3, 5, 7, 10, 15, 20, 25, 50, 0]
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
      return extend({}, this.innerPagination, this.pagination)
    },
    firstRowIndex () {
      const { page, rowsPerPage } = this.computedPagination
      return (page - 1) * rowsPerPage
    },
    lastRowIndex () {
      const { page, rowsPerPage } = this.computedPagination
      return page * rowsPerPage
    },
    isFirstPage () {
      const { page } = this.computedPagination
      return page <= 1
    },
    pagesNumber () {
      const { rowsPerPage } = this.computedPagination
      return Math.ceil(this.computedRowsNumber / rowsPerPage)
    },
    isLastPage () {
      if (this.lastRowIndex === 0) {
        return true
      }
      const { page } = this.computedPagination
      return page >= this.pagesNumber
    },
    computedRowsPerPageOptions () {
      return this.rowsPerPageOptions.map(count => ({
        label: count === 0 ? this.$q.i18n.table.allRows : '' + count,
        value: count
      }))
    }
  },
  watch: {
    pagesNumber (lastPage) {
      const currentPage = this.computedPagination.page
      if (lastPage && !currentPage) {
        this.setPagination({ page: 1 })
      }
      else if (lastPage < currentPage) {
        this.setPagination({ page: lastPage })
      }
    }
  },
  methods: {
    setPagination (val) {
      const newPagination = extend({}, this.computedPagination, val)

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
    },
    prevPage () {
      const { page } = this.computedPagination
      if (page > 1) {
        this.setPagination({page: page - 1})
      }
    },
    nextPage () {
      const { page, rowsPerPage } = this.computedPagination
      if (this.lastRowIndex > 0 && page * rowsPerPage < this.computedRowsNumber) {
        this.setPagination({page: page + 1})
      }
    }
  },
  created () {
    this.$emit('update:pagination', extend({}, this.computedPagination))
  }
}
