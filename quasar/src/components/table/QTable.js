import Vue from 'vue'

import Top from './table-top.js'
import TableHeader from './table-header.js'
import TableBody from './table-body.js'
import Bottom from './table-bottom.js'

import Sort from './table-sort.js'
import Filter from './table-filter.js'
import Pagination from './table-pagination.js'
import RowSelection from './table-row-selection.js'
import ColumnSelection from './table-column-selection.js'
import FullscreenMixin from '../../mixins/fullscreen.js'

export default Vue.extend({
  name: 'QTable',

  mixins: [
    FullscreenMixin,
    Top,
    TableHeader,
    TableBody,
    Bottom,
    Sort,
    Filter,
    Pagination,
    RowSelection,
    ColumnSelection
  ],

  props: {
    data: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    color: {
      type: String,
      default: 'grey-8'
    },
    grid: Boolean,
    dense: Boolean,
    columns: Array,
    loading: Boolean,
    title: String,
    hideHeader: Boolean,
    hideBottom: Boolean,
    dark: Boolean,
    flat: Boolean,
    bordered: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => ['horizontal', 'vertical', 'cell', 'none'].includes(v)
    },
    wrapCells: Boolean,
    binaryStateSort: Boolean,
    noDataLabel: String,
    noResultsLabel: String,
    loadingLabel: String,
    selectedRowsLabel: Function,
    rowsPerPageLabel: String,
    paginationLabel: Function,
    tableStyle: {
      type: [String, Array, Object],
      default: ''
    },
    tableClass: {
      type: [String, Array, Object],
      default: ''
    }
  },

  data () {
    return {
      rowsExpanded: {},
      innerPagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 5
      }
    }
  },

  computed: {
    computedData () {
      let rows = this.data.slice().map((row, i) => {
        row.__index = i
        return row
      })

      if (rows.length === 0) {
        return {
          rowsNumber: 0,
          rows: []
        }
      }
      if (this.isServerSide) {
        return { rows }
      }

      const { sortBy, descending, rowsPerPage } = this.computedPagination

      if (this.filter) {
        rows = this.filterMethod(rows, this.filter, this.computedCols, this.getCellValue)
      }

      if (this.columnToSort) {
        rows = this.sortMethod(rows, sortBy, descending)
      }

      const rowsNumber = rows.length

      if (rowsPerPage) {
        rows = rows.slice(this.firstRowIndex, this.lastRowIndex)
      }

      return { rowsNumber, rows }
    },

    computedRows () {
      return this.computedData.rows
    },

    computedRowsNumber () {
      return this.isServerSide
        ? this.computedPagination.rowsNumber || 0
        : this.computedData.rowsNumber
    },

    nothingToDisplay () {
      return this.computedRows.length === 0
    },

    isServerSide () {
      return this.computedPagination.rowsNumber !== void 0
    }
  },

  render (h) {
    return h('div',
      {
        staticClass: 'q-table__container',
        class: {
          'q-table--grid': this.grid,
          'q-table--dark': this.dark,
          'q-table--dense': this.dense,
          'q-table--flat': this.flat,
          'q-table--bordered': this.bordered,
          'q-table--no-wrap': this.wrapCells === false,
          [`q-table--${this.separator}-separator`]: true,
          fullscreen: this.inFullscreen,
          scroll: this.inFullscreen
        }
      },
      [
        this.getTop(h),
        this.getBody(h),
        this.getBottom(h)
      ]
    )
  },

  methods: {
    requestServerInteraction (prop = {}) {
      this.$nextTick(() => {
        this.$emit('request', {
          pagination: prop.pagination || this.computedPagination,
          filter: prop.filter || this.filter,
          getCellValue: this.getCellValue
        })
      })
    },

    getBody (h) {
      const hasHeader = !this.hideHeader

      if (this.grid === true) {
        const item = this.$scopedSlots.item

        if (item !== void 0) {
          return [
            (hasHeader && h('div', { staticClass: 'q-table__middle scroll' }, [
              h('table', {
                staticClass: 'q-table',
                class: { 'q-table--dark': this.dark }
              }, [
                this.getTableHeader(h)
              ])
            ])) || null,
            h('div', { staticClass: 'row' }, this.computedRows.map(row => {
              const
                key = row[this.rowKey],
                selected = this.isRowSelected(key)

              return item(this.addBodyRowMeta({
                key,
                row,
                cols: this.computedCols,
                colsMap: this.computedColsMap,
                __trClass: selected ? 'selected' : ''
              }))
            }))
          ]
        }
      }

      return h('div', { staticClass: 'q-table__middle scroll', class: this.tableClass, style: this.tableStyle }, [
        h('table', {
          staticClass: 'q-table',
          class: this.dark ? ' q-table--dark' : ''
        }, [
          (hasHeader && this.getTableHeader(h)) || null,
          this.getTableBody(h)
        ])
      ])
    }
  }
})
