import Top from './table-top'
import TableHeader from './table-header'
import TableBody from './table-body'
import Bottom from './table-bottom'

import Sort from './table-sort'
import Filter from './table-filter'
import Pagination from './table-pagination'
import RowSelection from './table-row-selection'
import ColumnSelection from './table-column-selection'
import Expand from './table-expand'
import FullscreenMixin from '../../mixins/fullscreen'

export default {
  name: 'q-table',
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
    ColumnSelection,
    Expand
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
    columns: Array,
    loader: Boolean,
    title: String,
    noTop: Boolean,
    noHeader: Boolean,
    noBottom: Boolean,
    dark: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => ['horizontal', 'vertical', 'cell', 'none'].includes(v)
    },
    noDataLabel: String,
    noResultsLabel: String,
    loaderLabel: String,
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
  computed: {
    computedRows () {
      let rows = this.data.slice().map((row, i) => {
        row.__index = i
        return row
      })

      if (rows.length === 0) {
        return []
      }
      if (this.isServerSide) {
        return rows
      }

      const { sortBy, descending, rowsPerPage } = this.computedPagination

      if (this.hasFilter) {
        rows = this.filterMethod(rows, this.filter, this.computedCols, this.getCellValue)
      }

      if (this.columnToSort) {
        rows = this.sortMethod(rows, sortBy, descending)
      }

      if (rowsPerPage) {
        rows = rows.slice(this.firstRowIndex, this.lastRowIndex)
      }

      return rows
    },
    computedRowsNumber () {
      return this.isServerSide
        ? this.computedPagination.rowsNumber || 0
        : this.data.length
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
        'class': {
          'q-table-container': true,
          'q-table-dark': this.dark,
          fullscreen: this.inFullscreen,
          scroll: this.inFullscreen
        }
      },
      [
        this.getTop(h),
        h('div', { staticClass: 'q-table-middle scroll', 'class': this.tableClass, style: this.tableStyle }, [
          h('table', { staticClass: `q-table q-table-${this.separator}-separator${this.dark ? ' q-table-dark' : ''}` },
            [
              this.getTableHeader(h),
              this.getTableBody(h)
            ]
          )
        ]),
        this.getBottom(h)
      ]
    )
  },
  methods: {
    requestServerInteraction (prop) {
      this.$nextTick(() => {
        this.$emit('request', {
          pagination: prop.pagination || this.computedPagination,
          filter: prop.filter || this.filter,
          getCellValue: this.getCellValue
        })
      })
    }
  }
}
