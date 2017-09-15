import { QSelect } from '../select'
import { QBtn } from '../btn'
import { QIcon } from '../icon'

export default {
  methods: {
    getBottom (h) {
      if (this.nothingToDisplay) {
        const message = this.filter
          ? this.noResultsLabel
          : (this.loader ? this.loaderLabel : this.noDataLabel)

        return h('div', { staticClass: 'q-datatable-bottom row items-center q-datatable-nodata' }, [
          h(QIcon, {props: {name: 'warning'}}),
          message
        ])
      }

      if (this.noBottom) {
        return
      }

      return h('div', { staticClass: 'q-datatable-bottom row items-center' },
        this.getPaginationRow(h)
      )
    },
    getPaginationRow (h) {
      const { page, rowsPerPage } = this.computedPagination

      return [
        h('div', { staticClass: 'col' }, [
          this.selection && this.rowsSelectedNumber > 0
            ? this.selectedRowsLabel(this.rowsSelectedNumber)
            : ''
        ]),
        h('div', [
          h('span', { style: {marginRight: '32px'} }, [
            this.rowsPerPageLabel
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
              ? this.paginationLabel(this.firstRowIndex + 1, Math.min(this.lastRowIndex, this.computedRowsNumber), this.computedRowsNumber)
              : this.paginationLabel(1, this.computedRowsNumber, this.computedRowsNumber)
          ]),
          h(QBtn, {
            props: {
              color: this.color,
              round: true,
              icon: 'chevron_left',
              small: true,
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
              icon: 'chevron_right',
              small: true,
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
