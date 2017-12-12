import { QSelect } from '../select'
import { QBtn } from '../btn'
import { QIcon } from '../icon'

export default {
  methods: {
    getBottom (h) {
      if (this.nothingToDisplay) {
        const message = this.filter
          ? this.noResultsLabel || this.$q.i18n.table.noResults
          : (this.loader ? this.loaderLabel || this.$q.i18n.table.loader : this.noDataLabel || this.$q.i18n.table.noData)

        return h('div', { staticClass: 'q-table-bottom row items-center q-table-nodata' }, [
          h(QIcon, {props: { name: this.$q.icon.table.warning }}),
          message
        ])
      }

      if (this.noBottom) {
        return
      }

      return h('div', { staticClass: 'q-table-bottom row items-center' },
        this.getPaginationRow(h)
      )
    },
    getPaginationRow (h) {
      const
        { page, rowsPerPage } = this.computedPagination,
        paginationLabel = this.paginationLabel || this.$q.i18n.table.pagination

      return [
        h('div', { staticClass: 'col' }, [
          this.selection && this.rowsSelectedNumber > 0
            ? (this.selectedRowsLabel || this.$q.i18n.table.selectedRows)(this.rowsSelectedNumber)
            : ''
        ]),
        h('div', [
          h('span', { style: {marginRight: '32px'} }, [
            this.rowsPerPageLabel || this.$q.i18n.table.rowsPerPage
          ]),
          h(QSelect, {
            staticClass: 'inline',
            style: {
              margin: '0 15px',
              minWidth: '50px'
            },
            props: {
              color: this.color,
              value: rowsPerPage,
              options: this.computedRowsPerPageOptions,
              dark: this.dark
            },
            on: {
              input: rowsPerPage => {
                this.setPagination({
                  page: 1,
                  rowsPerPage
                })
              }
            }
          }),
          h('span', { style: {margin: '0 32px'} }, [
            rowsPerPage
              ? paginationLabel(this.firstRowIndex + 1, Math.min(this.lastRowIndex, this.computedRowsNumber), this.computedRowsNumber)
              : paginationLabel(1, this.computedRowsNumber, this.computedRowsNumber)
          ]),
          h(QBtn, {
            props: {
              color: this.color,
              round: true,
              icon: this.$q.icon.table.prevPage,
              size: 'sm',
              flat: true,
              disable: page === 1
            },
            on: {
              click: () => {
                this.setPagination({ page: page - 1 })
              }
            }
          }),
          h(QBtn, {
            props: {
              color: this.color,
              round: true,
              icon: this.$q.icon.table.nextPage,
              size: 'sm',
              flat: true,
              disable: this.lastRowIndex === 0 || page * rowsPerPage >= this.computedRowsNumber
            },
            on: {
              click: () => {
                this.setPagination({ page: page + 1 })
              }
            }
          })
        ])
      ]
    }
  }
}
