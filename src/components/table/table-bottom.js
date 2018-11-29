import QSelect from '../select/QSelect.js'
import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

export default {
  computed: {
    navIcon () {
      const ico = [ this.$q.icon.table.prevPage, this.$q.icon.table.nextPage ]
      return this.$q.i18n.rtl ? ico.reverse() : ico
    }
  },
  methods: {
    getBottom (h) {
      if (this.hideBottom) {
        return
      }

      if (this.nothingToDisplay) {
        const message = this.filter
          ? this.noResultsLabel || this.$q.i18n.table.noResults
          : (this.loading ? this.loadingLabel || this.$q.i18n.table.loading : this.noDataLabel || this.$q.i18n.table.noData)

        return h('div', { staticClass: 'q-table__bottom row items-center q-table__bottom--nodata' }, [
          h(QIcon, {props: { name: this.$q.icon.table.warning }}),
          message
        ])
      }

      const bottom = this.$scopedSlots.bottom

      return h('div', {
        staticClass: 'q-table__bottom row items-center',
        class: bottom ? null : 'justify-end'
      }, bottom ? [ bottom(this.marginalsProps) ] : this.getPaginationRow(h))
    },
    getPaginationRow (h) {
      const
        { rowsPerPage } = this.computedPagination,
        paginationLabel = this.paginationLabel || this.$q.i18n.table.pagination,
        paginationSlot = this.$scopedSlots.pagination

      return [
        h('div', { staticClass: 'q-table__control' }, [
          h('div', [
            this.hasSelectionMode && this.rowsSelectedNumber > 0
              ? (this.selectedRowsLabel || this.$q.i18n.table.selectedRecords)(this.rowsSelectedNumber)
              : ''
          ])
        ]),
        h('div', { staticClass: 'q-table__separator col' }),
        (this.rowsPerPageOptions.length > 1 && h('div', { staticClass: 'q-table__control' }, [
          h('span', { staticClass: 'q-table__bottom-item' }, [
            this.rowsPerPageLabel || this.$q.i18n.table.recordsPerPage
          ]),
          h(QSelect, {
            staticClass: 'inline q-table__bottom-item',
            props: {
              color: this.color,
              value: rowsPerPage,
              options: this.computedRowsPerPageOptions,
              dark: this.dark,
              borderless: true,
              dense: true
            },
            on: {
              input: rowsPerPage => {
                this.setPagination({
                  page: 1,
                  rowsPerPage
                })
              }
            }
          })
        ])) || void 0,
        h('div', { staticClass: 'q-table__control' }, [
          paginationSlot
            ? paginationSlot(this.marginalsProps)
            : [
              h('span', { staticClass: 'q-table__bottom-item' }, [
                rowsPerPage
                  ? paginationLabel(this.firstRowIndex + 1, Math.min(this.lastRowIndex, this.computedRowsNumber), this.computedRowsNumber)
                  : paginationLabel(1, this.computedRowsNumber, this.computedRowsNumber)
              ]),
              h(QBtn, {
                props: {
                  color: this.color,
                  round: true,
                  icon: this.navIcon[0],
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
                  icon: this.navIcon[1],
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
