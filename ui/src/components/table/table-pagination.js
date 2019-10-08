function samePagination (oldPag, newPag) {
  for (let prop in newPag) {
    if (newPag[prop] !== oldPag[prop]) {
      return false
    }
  }
  return true
}

function fixPagination (p) {
  if (p.page < 1) {
    p.page = 1
  }
  if (p.rowsPerPage !== void 0 && p.rowsPerPage < 1) {
    p.rowsPerPage = 0
  }
  return p
}

export default {
  props: {
    pagination: Object,
    rowsPerPageOptions: {
      type: Array,
      default: () => [3, 5, 7, 10, 15, 20, 25, 50, 0]
    }
  },

  computed: {
    computedPagination () {
      return fixPagination({
        ...this.innerPagination,
        ...this.pagination
      })
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
      return this.computedPagination.page === 1
    },

    pagesNumber () {
      return this.computedPagination.rowsPerPage === 0
        ? 1
        : Math.max(
          1,
          Math.ceil(this.computedRowsNumber / this.computedPagination.rowsPerPage)
        )
    },

    isLastPage () {
      return this.lastRowIndex === 0
        ? true
        : this.computedPagination.page >= this.pagesNumber
    },

    computedRowsPerPageOptions () {
      return this.rowsPerPageOptions.map(count => ({
        label: count === 0 ? this.$q.lang.table.allRows : '' + count,
        value: count
      }))
    }
  },

  watch: {
    pagesNumber (lastPage, oldLastPage) {
      if (lastPage === oldLastPage) {
        return
      }

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
    __sendServerRequest (pagination) {
      this.requestServerInteraction({
        pagination,
        filter: this.filter
      })
    },

    setPagination (val, forceServerRequest) {
      const newPagination = fixPagination({
        ...this.computedPagination,
        ...val
      })

      if (samePagination(this.computedPagination, newPagination)) {
        if (this.isServerSide && forceServerRequest) {
          this.__sendServerRequest(newPagination)
        }
        return
      }

      if (this.isServerSide) {
        this.__sendServerRequest(newPagination)
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
        this.setPagination({ page: page - 1 })
      }
    },

    nextPage () {
      const { page, rowsPerPage } = this.computedPagination
      if (this.lastRowIndex > 0 && page * rowsPerPage < this.computedRowsNumber) {
        this.setPagination({ page: page + 1 })
      }
    }
  },

  created () {
    this.$emit('update:pagination', { ...this.computedPagination })
  }
}
