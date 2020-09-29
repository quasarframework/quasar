import { h } from 'vue'

import QSelect from '../select/QSelect.js'
import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

const bottomClass = 'q-table__bottom row items-center'

export default {
  props: {
    hideBottom: Boolean,
    hideSelectedBanner: Boolean,
    hideNoData: Boolean,
    hidePagination: Boolean
  },

  computed: {
    navIcon () {
      const ico = [
        this.iconFirstPage || this.$q.iconSet.table.firstPage,
        this.iconPrevPage || this.$q.iconSet.table.prevPage,
        this.iconNextPage || this.$q.iconSet.table.nextPage,
        this.iconLastPage || this.$q.iconSet.table.lastPage
      ]
      return this.$q.lang.rtl === true ? ico.reverse() : ico
    }
  },

  methods: {
    __getBottomDiv () {
      if (this.hideBottom === true) {
        return
      }

      if (this.nothingToDisplay === true) {
        if (this.hideNoData === true) {
          return
        }

        const message = this.loading === true
          ? this.loadingLabel || this.$q.lang.table.loading
          : (this.filter ? this.noResultsLabel || this.$q.lang.table.noResults : this.noDataLabel || this.$q.lang.table.noData)

        const noData = this.$slots['no-data']
        const children = noData !== void 0
          ? [ noData({ message, icon: this.$q.iconSet.table.warning, filter: this.filter }) ]
          : [
            h(QIcon, {
              class: 'q-table__bottom-nodata-icon',
              name: this.$q.iconSet.table.warning
            }),
            message
          ]

        return h('div', {
          class: bottomClass + ' q-table__bottom--nodata'
        }, children)
      }

      const bottom = this.$slots.bottom

      if (bottom !== void 0) {
        return h('div', { class: bottomClass }, [ bottom(this.marginalsScope) ])
      }

      const child = this.hideSelectedBanner !== true && this.hasSelectionMode === true && this.rowsSelectedNumber > 0
        ? [
          h('div', { class: 'q-table__control' }, [
            h('div', [
              (this.selectedRowsLabel || this.$q.lang.table.selectedRecords)(this.rowsSelectedNumber)
            ])
          ])
        ]
        : []

      if (this.hidePagination !== true) {
        return h('div', {
          class: bottomClass + ' justify-end'
        }, this.__getPaginationDiv(child))
      }

      if (child.length > 0) {
        return h('div', { class: bottomClass }, child)
      }
    },

    __onPagSelection (pag) {
      this.setPagination({
        page: 1,
        rowsPerPage: pag.value
      })
    },

    __getPaginationDiv (child) {
      let control
      const
        { rowsPerPage } = this.computedPagination,
        paginationLabel = this.paginationLabel || this.$q.lang.table.pagination,
        paginationSlot = this.$slots.pagination,
        hasOpts = this.rowsPerPageOptions.length > 1

      child.push(
        h('div', { class: 'q-table__separator col' })
      )

      if (hasOpts === true) {
        child.push(
          h('div', { class: 'q-table__control' }, [
            h('span', { class: 'q-table__bottom-item' }, [
              this.rowsPerPageLabel || this.$q.lang.table.recordsPerPage
            ]),
            h(QSelect, {
              class: 'q-table__select inline q-table__bottom-item',
              color: this.color,
              modelValue: rowsPerPage,
              options: this.computedRowsPerPageOptions,
              displayValue: rowsPerPage === 0
                ? this.$q.lang.table.allRows
                : rowsPerPage,
              dark: this.isDark,
              borderless: true,
              dense: true,
              optionsDense: true,
              optionsCover: true,
              'onUpdate:modelValue': this.__onPagSelection
            })
          ])
        )
      }

      if (paginationSlot !== void 0) {
        control = paginationSlot(this.marginalsScope)
      }
      else {
        control = [
          h('span', rowsPerPage !== 0 ? { class: 'q-table__bottom-item' } : {}, [
            rowsPerPage
              ? paginationLabel(this.firstRowIndex + 1, Math.min(this.lastRowIndex, this.computedRowsNumber), this.computedRowsNumber)
              : paginationLabel(1, this.filteredSortedRowsNumber, this.computedRowsNumber)
          ])
        ]

        if (rowsPerPage !== 0 && this.pagesNumber > 1) {
          const btnProps = {
            color: this.color,
            round: true,
            dense: true,
            flat: true
          }

          if (this.dense === true) {
            btnProps.size = 'sm'
          }

          this.pagesNumber > 2 && control.push(
            h(QBtn, {
              key: 'pgFirst',
              ...btnProps,
              icon: this.navIcon[0],
              disable: this.isFirstPage,
              onClick: this.firstPage
            })
          )

          control.push(
            h(QBtn, {
              key: 'pgPrev',
              ...btnProps,
              icon: this.navIcon[1],
              disable: this.isFirstPage,
              onClick: this.prevPage
            }),

            h(QBtn, {
              key: 'pgNext',
              ...btnProps,
              icon: this.navIcon[2],
              disable: this.isLastPage,
              onClick: this.nextPage
            })
          )

          this.pagesNumber > 2 && control.push(
            h(QBtn, {
              key: 'pgLast',
              ...btnProps,
              icon: this.navIcon[3],
              disable: this.isLastPage,
              onClick: this.lastPage
            })
          )
        }
      }

      child.push(
        h('div', { class: 'q-table__control' }, control)
      )

      return child
    }
  }
}
