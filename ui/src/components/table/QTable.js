import Vue from 'vue'

import Top from './table-top.js'
import TableHeader from './table-header.js'
import TableBody from './table-body.js'
import Bottom from './table-bottom.js'
import TableGrid from './table-grid.js'

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
    TableGrid,
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

    columns: Array,
    loading: Boolean,
    binaryStateSort: Boolean,

    title: String,

    hideHeader: Boolean,
    hideBottom: Boolean,

    grid: Boolean,
    dense: Boolean,
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => ['horizontal', 'vertical', 'cell', 'none'].includes(v)
    },
    wrapCells: Boolean,

    noDataLabel: String,
    noResultsLabel: String,
    loadingLabel: String,
    selectedRowsLabel: Function,
    rowsPerPageLabel: String,
    paginationLabel: Function,

    color: {
      type: String,
      default: 'grey-8'
    },

    tableStyle: [String, Array, Object],
    tableClass: [String, Array, Object],
    tableHeaderStyle: [String, Array, Object],
    tableHeaderClass: [String, Array, Object],
    cardStyle: [String, Array, Object],
    cardClass: [String, Array, Object],

    dark: Boolean
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

      if (this.isServerSide === true) {
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
      return this.isServerSide === true
        ? this.computedPagination.rowsNumber || 0
        : this.computedData.rowsNumber
    },

    nothingToDisplay () {
      return this.computedRows.length === 0
    },

    isServerSide () {
      return this.computedPagination.rowsNumber !== void 0
    },

    cardDefaultClass () {
      return ` q-table__card` +
        (this.dark === true ? ' q-table__card--dark' : '') +
        (this.square === true ? ` q-table--square` : '') +
        (this.flat === true ? ` q-table--flat` : '') +
        (this.bordered === true ? ` q-table--bordered` : '')
    },

    containerClass () {
      return `q-table__container q-table--${this.separator}-separator` +
        (this.grid === true ? ' q-table--grid' : this.cardDefaultClass) +
        (this.dark === true ? ` q-table--dark` : '') +
        (this.dense === true ? ` q-table--dense` : '') +
        (this.wrapCells === false ? ` q-table--no-wrap` : '') +
        (this.inFullscreen === true ? ` fullscreen scroll` : '')
    }
  },

  render (h) {
    const data = { staticClass: this.containerClass }

    if (this.grid === false) {
      data.class = this.cardClass
      data.style = this.cardStyle
    }

    return h('div', data, [
      this.getTop(h),
      this.getBody(h),
      this.getBottom(h)
    ])
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
      if (this.grid === true) {
        return this.getTableGrid(h)
      }

      return h('div', {
        staticClass: 'q-table__middle scroll',
        class: this.tableClass,
        style: this.tableStyle
      }, [
        h('table', { staticClass: 'q-table' }, [
          this.hideHeader !== true ? this.getTableHeader(h) : null,
          this.getTableBody(h)
        ])
      ])
    }
  }
})
