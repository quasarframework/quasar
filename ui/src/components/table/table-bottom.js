import WSelect from '../select/QSelect.js'
import WBtn from '../btn/QBtn.js'
import WIcon from '../icon/QIcon.js'

export default {
  computed: {
    navIcon () {
      const ico = [ this.$q.iconSet.table.prevPage, this.$q.iconSet.table.nextPage ]
      return this.$q.lang.rtl === true ? ico.reverse() : ico
    }
  },

  methods: {
    getBottom (h) {
      if (this.hideBottom === true) {
        return
      }

      if (this.nothingToDisplay === true) {
        const message = this.filter
          ? this.noResultsLabel || this.$q.lang.table.noResults
          : (this.loading === true ? this.loadingLabel || this.$q.lang.table.loading : this.noDataLabel || this.$q.lang.table.noData)

        return h('div', { staticClass: 'q-table__bottom row items-center q-table__bottom--nodata' }, [
          h(WIcon, { props: { name: this.$q.iconSet.table.warning } }),
          message
        ])
      }

      const bottom = this.$scopedSlots.bottom

      return h('div', {
        staticClass: 'q-table__bottom row items-center',
        class: bottom !== void 0 ? null : 'justify-end'
      }, bottom !== void 0 ? [ bottom(this.marginalsProps) ] : this.getPaginationRow(h))
    },

    getPaginationRow (h) {
      const
        { rowsPerPage } = this.computedPagination,
        paginationLabel = this.paginationLabel || this.$q.lang.table.pagination,
        paginationSlot = this.$scopedSlots.pagination

      return [
        h('div', { staticClass: 'q-table__control' }, [
          h('div', [
            this.hasSelectionMode === true && this.rowsSelectedNumber > 0
              ? (this.selectedRowsLabel || this.$q.lang.table.selectedRecords)(this.rowsSelectedNumber)
              : ''
          ])
        ]),

        h('div', { staticClass: 'q-table__separator col' }),

        this.rowsPerPageOptions.length > 1
          ? h('div', { staticClass: 'q-table__control' }, [
            h('span', { staticClass: 'q-table__bottom-item' }, [
              this.rowsPerPageLabel || this.$q.lang.table.recordsPerPage
            ]),
            h(WSelect, {
              staticClass: 'inline q-table__bottom-item',
              props: {
                color: this.color,
                value: rowsPerPage,
                options: this.computedRowsPerPageOptions,
                displayValue: rowsPerPage === 0
                  ? this.$q.lang.table.allRows
                  : rowsPerPage,
                dark: this.dark,
                borderless: true,
                dense: true,
                optionsDense: true
              },
              on: {
                input: pag => {
                  this.setPagination({
                    page: 1,
                    rowsPerPage: pag.value
                  })
                }
              }
            })
          ])
          : null,

        h('div', { staticClass: 'q-table__control' }, [
          paginationSlot !== void 0
            ? paginationSlot(this.marginalsProps)
            : [
              h('span', { staticClass: 'q-table__bottom-item' }, [
                rowsPerPage
                  ? paginationLabel(this.firstRowIndex + 1, Math.min(this.lastRowIndex, this.computedRowsNumber), this.computedRowsNumber)
                  : paginationLabel(1, this.computedRowsNumber, this.computedRowsNumber)
              ]),
              h(WBtn, {
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
              h(WBtn, {
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
