import Top from './table-top'
import TableHeader from './table-header'
import TableBody from './table-body'
import TableFooter from './table-footer'
import Bottom from './table-bottom'

import Sort from './table-sort'
import Filter from './table-filter'
import Pagination from './table-pagination'
import RowSelection from './table-row-selection'
import ColumnSelection from './table-column-selection'
import Expand from './table-expand'

export default {
  name: 'q-data-table',
  mixins: [
    Top,
    TableHeader,
    TableBody,
    TableFooter,
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
    compact: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => ['horizontal', 'vertical', 'cell', 'none'].includes(v)
    },
    noDataLabel: {
      type: String,
      default: 'No data available'
    },
    noResultsLabel: {
      type: String,
      default: 'No matching records found'
    },
    loaderLabel: {
      type: String,
      default: 'Loading...'
    },
    selectedRowsLabel: {
      type: Function,
      default: rows => `${rows} selected row(s).`
    },
    rowsPerPageLabel: {
      type: String,
      default: 'Rows per page:'
    },
    paginationLabel: {
      type: Function,
      default: (start, end, total) => `${start}-${end} of ${total}`
    },
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
      let rows = this.data.slice()

      if (rows.length === 0) {
        return []
      }
      if (this.isServerSide) {
        return rows
      }

      const { descending, rowsPerPage } = this.computedPagination

      if (this.hasFilter && this.filter) {
        rows = this.filterMethod(rows, this.computedColumns, this.filter)
      }

      if (this.columnToSort) {
        rows = this.sortMethod(rows, this.columnToSort, descending)
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
          'q-datatable': true,
          'q-datatable-dark': this.dark,
          'q-datatable-compact': this.compact
        }
      },
      [
        this.getTop(h),
        h('div', { staticClass: 'q-datatable-middle scroll', 'class': this.tableClass, style: this.tableStyle }, [
          h('table',
            {
              'class': [
                `q-table-${this.separator}-separator`,
                {
                  'q-table': true,
                  'q-table-dark': this.dark,
                  'q-table-compact': this.compact
                }
              ]
            },
            [
              this.getTableHeader(h),
              this.getTableBody(h),
              this.getTableFooter(h)
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
          filter: prop.filter || this.filter
        })
      })
    }
  }
}
