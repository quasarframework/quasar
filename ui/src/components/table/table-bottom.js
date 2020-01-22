import QSelect from '../select/QSelect.js'
import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import { cache } from '../../utils/vm.js'

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

        const noData = this.$scopedSlots['no-data']
        const children = noData !== void 0
          ? [ noData({ message, icon: this.$q.iconSet.table.warning, filter: this.filter }) ]
          : [
            h(QIcon, {
              staticClass: 'q-table__bottom-nodata-icon',
              props: { name: this.$q.iconSet.table.warning }
            }),
            message
          ]

        return h('div', {
          staticClass: 'q-table__bottom row items-center q-table__bottom--nodata'
        }, children)
      }

      const bottom = this.$scopedSlots.bottom

      return h('div', {
        staticClass: 'q-table__bottom row items-center',
        class: bottom !== void 0 ? null : 'justify-end'
      }, bottom !== void 0 ? [ bottom(this.marginalsProps) ] : this.getPaginationRow(h))
    },

    getPaginationRow (h) {
      let control
      const
        { rowsPerPage } = this.computedPagination,
        paginationLabel = this.paginationLabel || this.$q.lang.table.pagination,
        paginationSlot = this.$scopedSlots.pagination,
        hasOpts = this.rowsPerPageOptions.length > 1

      const child = [
        h('div', { staticClass: 'q-table__control' }, [
          h('div', [
            this.hasSelectionMode === true && this.rowsSelectedNumber > 0
              ? (this.selectedRowsLabel || this.$q.lang.table.selectedRecords)(this.rowsSelectedNumber)
              : ''
          ])
        ]),

        h('div', { staticClass: 'q-table__separator col' })
      ]

      if (hasOpts === true) {
        child.push(
          h('div', { staticClass: 'q-table__control' }, [
            h('span', { staticClass: 'q-table__bottom-item' }, [
              this.rowsPerPageLabel || this.$q.lang.table.recordsPerPage
            ]),
            h(QSelect, {
              staticClass: 'q-table__select inline q-table__bottom-item',
              props: {
                color: this.color,
                value: rowsPerPage,
                options: this.computedRowsPerPageOptions,
                displayValue: rowsPerPage === 0
                  ? this.$q.lang.table.allRows
                  : rowsPerPage,
                dark: this.isDark,
                borderless: true,
                dense: true,
                optionsDense: true,
                optionsCover: true
              },
              on: cache(this, 'pgSize', {
                input: pag => {
                  this.setPagination({
                    page: 1,
                    rowsPerPage: pag.value
                  })
                }
              })
            })
          ])
        )
      }

      if (paginationSlot !== void 0) {
        control = paginationSlot(this.marginalsProps)
      }
      else {
        control = [
          h('span', rowsPerPage !== 0 ? { staticClass: 'q-table__bottom-item' } : {}, [
            rowsPerPage
              ? paginationLabel(this.firstRowIndex + 1, Math.min(this.lastRowIndex, this.computedRowsNumber), this.computedRowsNumber)
              : paginationLabel(1, this.computedRowsNumber, this.computedRowsNumber)
          ])
        ]

        if (rowsPerPage !== 0) {
          const size = this.dense === true ? 'sm' : void 0

          control.push(
            h(QBtn, {
              props: {
                color: this.color,
                round: true,
                icon: this.navIcon[0],
                dense: true,
                flat: true,
                size,
                disable: this.isFirstPage
              },
              on: cache(this, 'pgPrev', { click: this.prevPage })
            }),

            h(QBtn, {
              props: {
                color: this.color,
                round: true,
                icon: this.navIcon[1],
                dense: true,
                size,
                flat: true,
                disable: this.isLastPage
              },
              on: cache(this, 'pgNext', { click: this.nextPage })
            })
          )
        }
      }

      child.push(
        h('div', { staticClass: 'q-table__control' }, control)
      )

      return child
    }
  }
}
