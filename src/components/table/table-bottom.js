import { QSelect } from '../select'
import { QBtn } from '../btn'
import { QIcon } from '../icon'

export default {
  methods: {
    getBottom (h) {
      if (this.hideBottom) {
        return
      }

      if (this.nothingToDisplay) {
        const message = this.filter
          ? this.noResultsLabel || this.$q.i18n.table.noResults
          : (this.loader ? this.loaderLabel || this.$q.i18n.table.loader : this.noDataLabel || this.$q.i18n.table.noData)

        return h('div', { staticClass: 'q-table-bottom row items-center q-table-nodata' }, [
          h(QIcon, {props: { name: this.$q.icon.table.warning }}),
          message
        ])
      }

      const bottom = this.$scopedSlots.bottom

      return h('div', { staticClass: 'q-table-bottom row items-center' },
        bottom ? [ bottom(this.marginalsProps) ] : this.getPaginationRow(h)
      )
    },
    getPaginationRow (h) {
      const
        { rowsPerPage } = this.computedPagination,
        paginationLabel = this.paginationLabel || this.$q.i18n.table.pagination,
        paginationSlot = this.$scopedSlots.pagination

      return [
        h('div', { staticClass: 'col' }, [
          this.selection && this.rowsSelectedNumber > 0
            ? (this.selectedRowsLabel || this.$q.i18n.table.selectedRows)(this.rowsSelectedNumber)
            : ''
        ]),
        h('div', { staticClass: 'flex items-center' }, [
          h('span', { staticClass: 'q-mr-lg' }, [
            this.rowsPerPageLabel || this.$q.i18n.table.rowsPerPage
          ]),
          h(QSelect, {
            staticClass: 'inline q-pb-none q-my-none q-ml-none q-mr-lg',
            style: {
              minWidth: '50px'
            },
            props: {
              color: this.color,
              value: rowsPerPage,
              options: this.computedRowsPerPageOptions,
              dark: this.dark,
              hideUnderline: true
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
          paginationSlot
            ? paginationSlot(this.marginalsProps)
            : [
              h('span', { staticClass: 'q-mr-lg' }, [
                rowsPerPage
                  ? paginationLabel(this.firstRowIndex + 1, Math.min(this.lastRowIndex, this.computedRowsNumber), this.computedRowsNumber)
                  : paginationLabel(1, this.computedRowsNumber, this.computedRowsNumber)
              ]),
              h(QBtn, {
                props: {
                  color: this.color,
                  round: true,
                  icon: this.$q.icon.table.prevPage,
                  dense: true,
                  flat: true,
                  disable: this.isFirstPage
                },
                on: { click: this.prevPage }
              }),
              h(QBtn, {
                props: {
                  color: this.color,
                  round: true,
                  icon: this.$q.icon.table.nextPage,
                  dense: true,
                  flat: true,
                  disable: this.isLastPage
                },
                on: { click: this.nextPage }
              })
            ]
        ])
      ]
    }
  }
}
