import Vue from 'vue'

import Top from './table-top.js'
import TableHeader from './table-header.js'
import TableBody from './table-body.js'
import Bottom from './table-bottom.js'
import TableGrid from './table-grid.js'
import QVirtualScroll from '../virtual-scroll/QVirtualScroll.js'
import QLinearProgress from '../linear-progress/QLinearProgress.js'

import { commonVirtPropsList } from '../../mixins/virtual-scroll.js'
import DarkMixin from '../../mixins/dark.js'
import getTableMiddle from './get-table-middle.js'

import Sort from './table-sort.js'
import Filter from './table-filter.js'
import Pagination from './table-pagination.js'
import RowSelection from './table-row-selection.js'
import ColumnSelection from './table-column-selection.js'
import FullscreenMixin from '../../mixins/fullscreen.js'

import { cache } from '../../utils/vm.js'

const commonVirtPropsObj = {}
commonVirtPropsList.forEach(p => { commonVirtPropsObj[p] = {} })

export default Vue.extend({
  name: 'QTable',

  mixins: [
    DarkMixin,

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
      type: [ String, Function ],
      default: 'id'
    },

    columns: Array,
    loading: Boolean,
    binaryStateSort: Boolean,

    title: String,

    hideHeader: Boolean,
    hideBottom: Boolean,

    grid: Boolean,
    gridHeader: Boolean,

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

    virtualScroll: Boolean,
    ...commonVirtPropsObj,

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
    cardContainerClass: [String, Array, Object],
    cardContainerStyle: [String, Array, Object],
    cardStyle: [String, Array, Object],
    cardClass: [String, Array, Object]
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

  watch: {
    needsReset () {
      this.hasVirtScroll === true && this.$refs.virtScroll !== void 0 && this.$refs.virtScroll.reset()
    }
  },

  computed: {
    getRowKey () {
      return typeof this.rowKey === 'function'
        ? this.rowKey
        : row => row[this.rowKey]
    },

    hasVirtScroll () {
      return this.grid !== true && this.virtualScroll === true
    },

    needsReset () {
      return ['tableStyle', 'tableClass', 'tableHeaderStyle', 'tableHeaderClass', 'containerClass']
        .map(p => this[p]).join(';')
    },

    computedData () {
      let rows = this.data

      if (rows.length === 0) {
        return {
          rowsNumber: 0,
          rows
        }
      }

      if (this.isServerSide === true) {
        return { rows }
      }

      const { sortBy, descending, rowsPerPage } = this.computedPagination

      if (this.filter) {
        rows = this.filterMethod(rows, this.filter, this.computedCols, this.getCellValue)
      }

      if (this.columnToSort !== void 0) {
        rows = this.sortMethod(
          this.data === rows ? rows.slice() : rows,
          sortBy,
          descending
        )
      }

      const rowsNumber = rows.length

      if (rowsPerPage !== 0) {
        if (this.firstRowIndex === 0 && this.data !== rows) {
          if (rows.length > this.lastRowIndex) {
            rows.length = this.lastRowIndex
          }
        }
        else {
          rows = rows.slice(this.firstRowIndex, this.lastRowIndex)
        }
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
        (this.isDark === true ? ' q-table__card--dark q-dark' : '') +
        (this.square === true ? ` q-table--square` : '') +
        (this.flat === true ? ` q-table--flat` : '') +
        (this.bordered === true ? ` q-table--bordered` : '')
    },

    containerClass () {
      return `q-table__container q-table--${this.separator}-separator` +
        (this.loading === true ? ' q-table--loading' : '') +
        (this.grid === true ? ' q-table--grid' : this.cardDefaultClass) +
        (this.isDark === true ? ` q-table--dark` : '') +
        (this.dense === true ? ` q-table--dense` : '') +
        (this.wrapCells === false ? ` q-table--no-wrap` : '') +
        (this.inFullscreen === true ? ` fullscreen scroll` : '')
    },

    virtProps () {
      const props = {}

      commonVirtPropsList
        .forEach(p => { props[p] = this[p] })

      if (props.virtualScrollItemSize === void 0) {
        props.virtualScrollItemSize = this.dense === true ? 28 : 48
      }

      return props
    }
  },

  render (h) {
    const child = [ this.getTop(h) ]
    const data = { staticClass: this.containerClass }

    if (this.grid === true) {
      child.push(this.getGridHeader(h))
    }
    else {
      Object.assign(data, {
        class: this.cardClass,
        style: this.cardStyle
      })
    }

    child.push(
      this.getBody(h),
      this.getBottom(h)
    )

    if (this.loading === true && this.$scopedSlots.loading !== void 0) {
      child.push(
        this.$scopedSlots.loading()
      )
    }

    return h('div', data, child)
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

    resetVirtualScroll () {
      this.hasVirtScroll === true && this.$refs.virtScroll.reset()
    },

    getBody (h) {
      if (this.grid === true) {
        return this.getGridBody(h)
      }

      const header = this.hideHeader !== true ? this.getTableHeader(h) : null

      return this.hasVirtScroll === true
        ? h(QVirtualScroll, {
          ref: 'virtScroll',
          props: {
            ...this.virtProps,
            items: this.computedRows,
            type: '__qtable'
          },
          on: cache(this, 'vs', {
            'virtual-scroll': this.__onVScroll
          }),
          class: this.tableClass,
          style: this.tableStyle,
          scopedSlots: {
            before: header === null
              ? void 0
              : () => header,
            default: this.getTableRowVirtual(h)
          }
        })
        : getTableMiddle(h, {
          staticClass: 'scroll',
          class: this.tableClass,
          style: this.tableStyle
        }, [
          header,
          this.getTableBody(h)
        ])
    },

    scrollTo (toIndex) {
      if (this.$refs.virtScroll !== void 0) {
        this.$refs.virtScroll.scrollTo(toIndex)
        return
      }

      toIndex = parseInt(toIndex, 10)
      const rowEl = this.$el.querySelector(`tbody tr:nth-of-type(${toIndex + 1})`)

      if (rowEl !== null) {
        const scrollTarget = this.$el.querySelector('.q-table__middle.scroll')
        const { offsetTop } = rowEl
        const direction = offsetTop < scrollTarget.scrollTop ? 'decrease' : 'increase'

        scrollTarget.scrollTop = offsetTop

        this.$emit('virtual-scroll', {
          index: toIndex,
          from: 0,
          to: this.pagination.rowsPerPage - 1,
          direction
        })
      }
    },

    __onVScroll (info) {
      this.$emit('virtual-scroll', info)
    },

    __getProgress (h) {
      return [
        h(QLinearProgress, {
          staticClass: 'q-table__linear-progress',
          props: {
            color: this.color,
            dark: this.isDark,
            indeterminate: true,
            trackColor: 'transparent'
          }
        })
      ]
    }
  }
})
