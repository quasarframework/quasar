import { computed, getCurrentInstance, h, ref, watch } from 'vue'

import QTh from './QTh.js'

import QSeparator from '../separator/QSeparator.js'
import QIcon from '../icon/QIcon.js'
import QVirtualScroll from '../virtual-scroll/QVirtualScroll.js'
import QSelect from '../select/QSelect.js'
import QLinearProgress from '../linear-progress/QLinearProgress.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QBtn from '../btn/QBtn.js'

import getTableMiddle from './get-table-middle.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import { commonVirtScrollPropsList } from '../virtual-scroll/use-virtual-scroll.js'
import useFullscreen, {
  useFullscreenEmits,
  useFullscreenProps
} from '../../composables/private.use-fullscreen/use-fullscreen.js'

import { useTableSort, useTableSortProps } from './table-sort.js'
import { useTableFilter, useTableFilterProps } from './table-filter.js'
import {
  useTablePagination,
  useTablePaginationProps,
  useTablePaginationState
} from './table-pagination.js'
import {
  useTableRowSelection,
  useTableRowSelectionEmits,
  useTableRowSelectionProps
} from './table-row-selection.js'
import {
  useTableRowExpand,
  useTableRowExpandEmits,
  useTableRowExpandProps
} from './table-row-expand.js'
import {
  useTableColumnSelection,
  useTableColumnSelectionProps
} from './table-column-selection.js'

import {
  injectMultipleProps,
  injectProp
} from '../../utils/private.inject-obj-prop/inject-obj-prop.js'
import { createComponent } from '../../utils/private.create/create.js'

const bottomClass = 'q-table__bottom row items-center'

const virtScrollPassthroughProps = {}
commonVirtScrollPropsList.forEach(p => {
  virtScrollPassthroughProps[p] = {}
})

function getCellValue(col, row) {
  const val = typeof col.field === 'function' ? col.field(row) : row[col.field]
  return col.format !== void 0 ? col.format(val, row) : val
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/table
 */
/**
 * Override default effect when table is in loading state; Suggestion: QInnerLoading
 *
 * @api slot loading
 */

/**
 * Slot to use for defining an item when in 'grid' mode; Suggestion: QCard
 *
 * @api slot item
 * @scope key {Any} Row/Item's key
 * @scope row {Object} Row/Item object
 * @scope rowIndex {Number} Row/Item's index (0 based) in the filtered and sorted table
 * @scope pageIndex {Number} Row/Item's index (0 based) in the current page of the filtered and sorted table
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row/item selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row/item expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 */

/**
 * Slot to define how a body row looks like; Suggestion: QTr + Td
 *
 * @api slot body
 * @scope key {Any} Row's key
 * @scope row {Object} Row object
 * @scope rowIndex {Number} Row's index (0 based) in the filtered and sorted table
 * @scope pageIndex {Number} Row's index (0 based) in the current page of the filtered and sorted table
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 * @scope __trClass {String} Internal prop passed down to QTr (if used)
 * @scope __trStyle {String} Internal prop passed down to QTr (if used)
 */

/**
 * Slot to define how all body cells look like; Suggestion: QTd
 *
 * @api slot body-cell
 * @scope col {Object} Column definition for column associated with table cell
 * @scope value {Any} Parsed/Formatted value of table cell
 * @scope key {Any} Row's key
 * @scope row {Object} Row object
 * @scope rowIndex {Number} Row's index (0 based) in the filtered and sorted table
 * @scope pageIndex {Number} Row's index (0 based) in the current page of the filtered and sorted table
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 */

/**
 * Slot to define how a specific column cell looks like; replace '[name]' with column name (from columns definition object)
 *
 * @api slot body-cell-[name]
 * @scope col {Object} Column definition for column associated with table cell
 * @scope value {Any} Parsed/Formatted value of table cell
 * @scope key {Any} Row's key
 * @scope row {Object} Row object
 * @scope rowIndex {Number} Row's index (0 based) in the filtered and sorted table
 * @scope pageIndex {Number} Row's index (0 based) in the current page of the filtered and sorted table
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 */

/**
 * Slot to define how header looks like; Suggestion: QTr + QTh
 *
 * @api slot header
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 * @scope __trClass {String} Internal prop passed down to QTr (if used)
 * @scope header {Boolean} Internal prop passed down to QTh (if used); Always 'true'
 */

/**
 * Slot to define how each header cell looks like; Suggestion: QTh
 *
 * @api slot header-cell
 * @scope col {Object} Column definition associated to header cell
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 */

/**
 * Slot to define how a specific header cell looks like; replace '[name]' with column name (from columns definition object)
 *
 * @api slot header-cell-[name]
 * @scope col {Object} Column definition associated to header cell
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 */

/**
 * Slot to define how body selection column looks like; Suggestion: QCheckbox
 *
 * @api slot body-selection
 * @scope key {Any} Row's key
 * @scope row {Object} Row object
 * @scope rowIndex {Number} Row's index (0 based) in the filtered and sorted table
 * @scope pageIndex {Number} Row's index (0 based) in the current page of the filtered and sorted table
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 */

/**
 * Slot to define how header selection column looks like (available only for multiple selection mode); Suggestion: QCheckbox
 *
 * @api slot header-selection
 * @scope cols {Object} Column definitions
 * @scope colsMap {Object} Column mapping (key is column name, value is column object)
 * @scope sort {Function} Trigger a table sort
 * @scope selected {Boolean} (Only if using selection) Is row selected? Can directly be assigned new Boolean value which changes selection state
 * @scope expand {Boolean} Is row expanded? Can directly be assigned new Boolean value which changes expanded state
 * @scope color {String} Color name for component from the Quasar Color Palette
 * @scope dark {Boolean|null} Notify the component that the background is a dark color
 * @scope dense {Boolean} Dense mode; occupies less space
 */

/**
 * Slot to define how top extra row looks like
 *
 * @api slot top-row
 * @scope cols {Object} Column definitions
 */

/**
 * Slot to define how bottom extra row looks like
 *
 * @api slot bottom-row
 * @scope cols {Object} Column definitions
 */

/**
 * Slot to define how table top looks like
 *
 * @api slot top
 * @scope pagination {Object} Pagination object
 * @scope pagesNumber {Number} Number of pages available
 * @scope isFirstPage {Boolean} Are we on first page?
 * @scope isLastPage {Boolean} Are we on last page?
 * @scope firstPage {Function} Navigates to first page
 * @scope prevPage {Function} Navigates to previous page, if available
 * @scope nextPage {Function} Navigates to next page, if available
 * @scope lastPage {Function} Navigates to last page
 * @scope inFullscreen {Boolean} Is table in fullscreen mode?
 * @scope toggleFullscreen {Function} Toggles fullscreen mode
 */

/**
 * Slot to define how table bottom looks like
 *
 * @api slot bottom
 * @scope pagination {Object} Pagination object
 * @scope pagesNumber {Number} Number of pages available
 * @scope isFirstPage {Boolean} Are we on first page?
 * @scope isLastPage {Boolean} Are we on last page?
 * @scope firstPage {Function} Navigates to first page
 * @scope prevPage {Function} Navigates to previous page, if available
 * @scope nextPage {Function} Navigates to next page, if available
 * @scope lastPage {Function} Navigates to last page
 * @scope inFullscreen {Boolean} Is table in fullscreen mode?
 * @scope toggleFullscreen {Function} Toggles fullscreen mode
 */

/**
 * Slot to override default pagination label and buttons
 *
 * @api slot pagination
 * @scope pagination {Object} Pagination object
 * @scope pagesNumber {Number} Number of pages available
 * @scope isFirstPage {Boolean} Are we on first page?
 * @scope isLastPage {Boolean} Are we on last page?
 * @scope firstPage {Function} Navigates to first page
 * @scope prevPage {Function} Navigates to previous page, if available
 * @scope nextPage {Function} Navigates to next page, if available
 * @scope lastPage {Function} Navigates to last page
 * @scope inFullscreen {Boolean} Is table in fullscreen mode?
 * @scope toggleFullscreen {Function} Toggles fullscreen mode
 */

/**
 * Slot to define how left part of the table top looks like
 *
 * @api slot top-left
 * @scope pagination {Object} Pagination object
 * @scope pagesNumber {Number} Number of pages available
 * @scope isFirstPage {Boolean} Are we on first page?
 * @scope isLastPage {Boolean} Are we on last page?
 * @scope firstPage {Function} Navigates to first page
 * @scope prevPage {Function} Navigates to previous page, if available
 * @scope nextPage {Function} Navigates to next page, if available
 * @scope lastPage {Function} Navigates to last page
 * @scope inFullscreen {Boolean} Is table in fullscreen mode?
 * @scope toggleFullscreen {Function} Toggles fullscreen mode
 */

/**
 * Slot to define how right part of the table top looks like
 *
 * @api slot top-right
 * @scope pagination {Object} Pagination object
 * @scope pagesNumber {Number} Number of pages available
 * @scope isFirstPage {Boolean} Are we on first page?
 * @scope isLastPage {Boolean} Are we on last page?
 * @scope firstPage {Function} Navigates to first page
 * @scope prevPage {Function} Navigates to previous page, if available
 * @scope nextPage {Function} Navigates to next page, if available
 * @scope lastPage {Function} Navigates to last page
 * @scope inFullscreen {Boolean} Is table in fullscreen mode?
 * @scope toggleFullscreen {Function} Toggles fullscreen mode
 */

/**
 * Slot to define how top table section looks like when user has selected at least one row
 *
 * @api slot top-selection
 * @scope pagination {Object} Pagination object
 * @scope pagesNumber {Number} Number of pages available
 * @scope isFirstPage {Boolean} Are we on first page?
 * @scope isLastPage {Boolean} Are we on last page?
 * @scope firstPage {Function} Navigates to first page
 * @scope prevPage {Function} Navigates to previous page, if available
 * @scope nextPage {Function} Navigates to next page, if available
 * @scope lastPage {Function} Navigates to last page
 * @scope inFullscreen {Boolean} Is table in fullscreen mode?
 * @scope toggleFullscreen {Function} Toggles fullscreen mode
 */

/**
 * Slot to define how the bottom will look like when is nothing to display
 *
 * @api slot no-data
 * @scope message {String} The suggested message
 * @scope icon {String} The suggested icon name (following Quasar convention)
 * @scope filter {String|Object} String/Object to filter table with (the 'filter' prop)
 */
export default createComponent({
  name: 'QTable',

  props: {
    /**
     * Rows of data to display
     *
     * @api prop rows
     * @type {Array}
     * @category general
     * @required
     * @example # :rows="myData"
     */
    rows: {
      type: Array,
      required: true
    },
    /**
     * Property of each row that defines the unique key of each row (the result must be a primitive, not Object, Array, etc); The value of property must be string or a function taking a row and returning the desired (nested) key in the row; If supplying a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop row-key
     * @type {String|Function}
     * @default 'id'
     * @category general
     * @example 'name'
     * @example row => row.name
     */
    rowKey: {
      type: [String, Function],
      default: 'id'
    },

    /**
     * The column definitions (Array of Objects)
     *
     * @api prop columns
     * @type {Array}
     * @category column
     * @example # :columns="tableColumns"
     */
    columns: Array,
    /**
     * Put Table into 'loading' state; Notify the user something is happening behind the scenes
     *
     * @api prop loading
     * @type {Boolean}
     * @category behavior|content
     */
    loading: Boolean,

    /**
     * Icon name following Quasar convention for stepping to first page; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop icon-first-page
     * @extends icon
     */
    iconFirstPage: String,
    /**
     * Icon name following Quasar convention for stepping to previous page; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop icon-prev-page
     * @extends icon
     */
    iconPrevPage: String,
    /**
     * Icon name following Quasar convention for stepping to next page; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop icon-next-page
     * @extends icon
     */
    iconNextPage: String,
    /**
     * Icon name following Quasar convention for stepping to last page; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop icon-last-page
     * @extends icon
     */
    iconLastPage: String,

    /**
     * Table title
     *
     * @api prop title
     * @type {String}
     * @category content
     * @example 'Device list'
     */
    title: String,

    /**
     * Hide table header layer
     *
     * @api prop hide-header
     * @type {Boolean}
     * @category content
     */
    hideHeader: Boolean,

    /**
     * Display data as a grid instead of the default table
     *
     * @api prop grid
     * @type {Boolean}
     * @category behavior
     */
    grid: Boolean,
    /**
     * Display header for grid-mode also
     *
     * @api prop grid-header
     * @type {Boolean}
     * @category behavior|content
     */
    gridHeader: Boolean,

    /**
     * Dense mode; Connect with $q.screen for responsive behavior
     *
     * @api prop dense
     * @extends dense
     */
    dense: Boolean,
    /**
     * @api prop flat
     * @extends flat
     */
    flat: Boolean,
    /**
     * @api prop bordered
     * @extends bordered
     */
    bordered: Boolean,
    /**
     * @api prop square
     * @extends square
     */
    square: Boolean,
    /**
     * Use a separator/border between rows, columns or all cells
     *
     * @api prop separator
     * @type {String}
     * @default 'horizontal'
     * @category content
     */
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => ['horizontal', 'vertical', 'cell', 'none'].includes(v)
    },
    /**
     * Wrap text within table cells
     *
     * @api prop wrap-cells
     * @type {Boolean}
     * @category content
     */
    wrapCells: Boolean,

    /**
     * Display data using QVirtualScroll (for non-grid mode only)
     *
     * @api prop virtual-scroll
     * @type {Boolean}
     * @category virtual-scroll
     */
    virtualScroll: Boolean,
    /**
     * @api prop virtual-scroll-target
     * @extends scroll-target
     */
    virtualScrollTarget: {},
    ...virtScrollPassthroughProps,

    /**
     * Override default text to display when no data is available
     *
     * @api prop no-data-label
     * @type {String}
     * @category content
     * @example 'No devices available'
     */
    noDataLabel: String,
    /**
     * Override default text to display when user filters the table and no matched results are found
     *
     * @api prop no-results-label
     * @type {String}
     * @category content
     * @example 'No matched records'
     */
    noResultsLabel: String,
    /**
     * Override default text to display when table is in loading state (see 'loading' prop)
     *
     * @api prop loading-label
     * @type {String}
     * @category content
     * @example 'Loading devices...'
     */
    loadingLabel: String,
    /**
     * Text to display when user selected at least one row; For best performance, reference it from your scope and do not define it inline
     *
     * @api prop selected-rows-label
     * @type {Function}
     * @category selection
     * @example (numberOfRows) => `Selected: ${ numberOfRows } entries`
     */
    selectedRowsLabel: Function,
    /**
     * Text to override default rows per page label at bottom of table
     *
     * @api prop rows-per-page-label
     * @type {String}
     * @category pagination
     * @example 'Records per page:'
     */
    rowsPerPageLabel: String,
    /**
     * Text to override default pagination label at bottom of table (unless 'pagination' scoped slot is used); For best performance, reference it from your scope and do not define it inline
     *
     * @api prop pagination-label
     * @type {Function}
     * @category pagination
     * @example (start, end, total) => `${ start }-${ end } of ${ total }`
     */
    paginationLabel: Function,

    /**
     * @api prop color
     * @extends color
     * @default 'grey-8'
     */
    color: {
      type: String,
      default: 'grey-8'
    },

    /**
     * CSS classes to apply to the title (if using 'title' prop)
     *
     * @api prop title-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-special-class'
     * @example 'text-h1'
     * @example { 'text-h1': true }
     */
    titleClass: [String, Array, Object],
    /**
     * CSS style to apply to native HTML <table> element's wrapper (which is a DIV)
     *
     * @api prop table-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background-color: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    tableStyle: [String, Array, Object],
    /**
     * CSS classes to apply to native HTML <table> element's wrapper (which is a DIV)
     *
     * @api prop table-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-special-class'
     * @example { 'my-special-class': true }
     */
    tableClass: [String, Array, Object],
    /**
     * CSS style to apply to header of native HTML <table> (which is a TR)
     *
     * @api prop table-header-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background-color: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    tableHeaderStyle: [String, Array, Object],
    /**
     * CSS classes to apply to header of native HTML <table> (which is a TR)
     *
     * @api prop table-header-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-special-class'
     * @example { 'my-special-class': true }
     */
    tableHeaderClass: [String, Array, Object],
    /**
     * CSS style to apply to the table rows (which are TR elements); For best performance, reference it from your scope and do not define it inline
     *
     * @api prop table-row-style-fn
     * @type {Function}
     * @category style
     * @added-in v2.18
     */
    tableRowStyleFn: Function,
    /**
     * CSS class(es) to apply the table rows (which are TR elements); For best performance, reference it from your scope and do not define it inline
     *
     * @api prop table-row-class-fn
     * @type {Function}
     * @category style
     * @added-in v2.18
     */
    tableRowClassFn: Function,
    /**
     * CSS classes to apply to the cards container (when in grid mode)
     *
     * @api prop card-container-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-special-class'
     * @example 'justify-center'
     * @example { 'my-special-class': true }
     */
    cardContainerClass: [String, Array, Object],
    /**
     * CSS style to apply to the cards container (when in grid mode)
     *
     * @api prop card-container-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background-color: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    cardContainerStyle: [String, Array, Object],
    /**
     * CSS style to apply to the card (when in grid mode) or container card (when not in grid mode)
     *
     * @api prop card-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background-color: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    cardStyle: [String, Array, Object],
    /**
     * CSS classes to apply to the card (when in grid mode) or container card (when not in grid mode)
     *
     * @api prop card-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-special-class'
     * @example { 'my-special-class': true }
     */
    cardClass: [String, Array, Object],
    /**
     * (Grid mode only) CSS style to apply to the row/record card; Has no effect when the 'item' slot is used; For best performance, reference it from your scope and do not define it inline
     *
     * @api prop card-style-fn
     * @type {Function}
     * @category style
     * @added-in v2.18
     */
    cardStyleFn: Function,
    /**
     * (Grid mode only) CSS class(es) to apply the row/record card; Has no effect when the 'item' slot is used; For best performance, reference it from your scope and do not define it inline
     *
     * @api prop card-class-fn
     * @type {Function}
     * @category style
     * @added-in v2.18
     */
    cardClassFn: Function,

    /**
     * Hide table bottom layer regardless of what it has to display
     *
     * @api prop hide-bottom
     * @type {Boolean}
     * @category content
     */
    hideBottom: Boolean,
    /**
     * Hide the selected rows banner (if any)
     *
     * @api prop hide-selected-banner
     * @type {Boolean}
     * @category content
     */
    hideSelectedBanner: Boolean,
    /**
     * Hide the default no data bottom layer
     *
     * @api prop hide-no-data
     * @type {Boolean}
     * @category content
     */
    hideNoData: Boolean,
    /**
     * Hide the pagination controls at the bottom
     *
     * @api prop hide-pagination
     * @type {Boolean}
     * @category content
     */
    hidePagination: Boolean,

    /**
     * Emitted when user clicks/taps on a row; Is not emitted when using body/row/item scoped slots
     *
     * @api event row-click
     * @param {Event} evt JS event object
     * @param {Object} row Row data
     * @param {Number} index Row page index
     */
    onRowClick: Function,

    /**
     * Emitted when user quickly double clicks/taps on a row; Is not emitted when using body/row/item scoped slots
     *
     * @api event row-dblclick
     * @param {Event} evt JS event object
     * @param {Object} row Row data
     * @param {Number} index Row page index
     */
    onRowDblclick: Function,

    /**
     * Emitted when user right clicks/long taps on a row; Is not emitted when using body/row/item scoped slots
     *
     * @api event row-contextmenu
     * @param {Event} evt JS event object
     * @param {Object} row Row data
     * @param {Number} index Row page index
     */
    onRowContextmenu: Function,

    ...useDarkProps,
    ...useFullscreenProps,

    ...useTableColumnSelectionProps,
    ...useTableFilterProps,
    ...useTablePaginationProps,
    ...useTableRowExpandProps,
    ...useTableRowSelectionProps,
    ...useTableSortProps
  },

  emits: [
    /**
     * Emitted when a server request is triggered
     *
     * @api event request
     * @param {Object} requestProp Props of the request
     */
    'request',

    /**
     * Emitted when the virtual scroll occurs, if using virtual scroll
     *
     * @api event virtual-scroll
     * @param {Object} details Object of properties on the new scroll position
     */
    'virtualScroll',
    ...useFullscreenEmits,
    ...useTableRowExpandEmits,
    ...useTableRowSelectionEmits
  ],

  setup(props, { slots, emit }) {
    const vm = getCurrentInstance()
    const {
      proxy: { $q }
    } = vm

    const isDark = useDark(props, $q)
    const { inFullscreen, toggleFullscreen } = useFullscreen()

    const getRowKey = computed(() =>
      typeof props.rowKey === 'function'
        ? props.rowKey
        : row => row[props.rowKey]
    )

    const rootRef = ref(null)
    const virtScrollRef = ref(null)
    const hasVirtScroll = computed(() => !props.grid && props.virtualScroll)

    const cardDefaultClass = computed(
      () =>
        ' q-table__card' +
        (isDark.value ? ' q-table__card--dark q-dark' : '') +
        (props.square ? ' q-table--square' : '') +
        (props.flat ? ' q-table--flat' : '') +
        (props.bordered ? ' q-table--bordered' : '')
    )

    const containerClass = computed(
      () =>
        `q-table__container q-table--${props.separator}-separator column no-wrap` +
        (props.grid ? ' q-table--grid' : cardDefaultClass.value) +
        (isDark.value ? ' q-table--dark' : '') +
        (props.dense ? ' q-table--dense' : '') +
        (props.wrapCells ? '' : ' q-table--no-wrap') +
        (inFullscreen.value ? ' fullscreen scroll' : '')
    )

    const rootContainerClass = computed(
      () => containerClass.value + (props.loading ? ' q-table--loading' : '')
    )

    watch(
      () =>
        props.tableStyle +
        props.tableClass +
        props.tableHeaderStyle +
        props.tableHeaderClass +
        containerClass.value,
      () => {
        if (hasVirtScroll.value) virtScrollRef.value?.reset()
      }
    )

    const {
      innerPagination,
      computedPagination,
      isServerSide,

      requestServerInteraction,
      setPagination
    } = useTablePaginationState(vm, getCellValue)

    const { computedFilterMethod } = useTableFilter(props, setPagination)
    const { isRowExpanded, setExpanded, updateExpanded } = useTableRowExpand(
      props,
      emit
    )

    const filteredSortedRows = computed(() => {
      let rows = props.rows

      if (isServerSide.value || rows.length === 0) {
        return rows
      }

      const { sortBy, descending } = computedPagination.value

      if (props.filter) {
        rows = computedFilterMethod.value(
          rows,
          props.filter,
          computedCols.value,
          getCellValue
        )
      }

      if (columnToSort.value !== null) {
        rows = computedSortMethod.value(
          props.rows === rows ? [...rows] : rows,
          sortBy,
          descending
        )
      }

      return rows
    })

    const filteredSortedRowsNumber = computed(
      () => filteredSortedRows.value.length
    )

    const computedRows = computed(() => {
      let rows = filteredSortedRows.value

      if (isServerSide.value) return rows

      const { rowsPerPage } = computedPagination.value

      if (rowsPerPage !== 0) {
        if (firstRowIndex.value === 0 && props.rows !== rows) {
          if (rows.length > lastRowIndex.value) {
            rows = rows.slice(0, lastRowIndex.value)
          }
        } else {
          rows = rows.slice(firstRowIndex.value, lastRowIndex.value)
        }
      }

      return rows
    })

    const {
      hasSelectionMode,
      singleSelection,
      multipleSelection,
      allRowsSelected,
      someRowsSelected,
      rowsSelectedNumber,

      isRowSelected,
      clearSelection,
      updateSelection
    } = useTableRowSelection(props, emit, computedRows, getRowKey)

    const { colList, computedCols, computedColsMap, computedColspan } =
      useTableColumnSelection(props, computedPagination, hasSelectionMode)

    const { columnToSort, computedSortMethod, sort } = useTableSort(
      props,
      computedPagination,
      colList,
      setPagination
    )

    const {
      firstRowIndex,
      lastRowIndex,
      isFirstPage,
      isLastPage,
      pagesNumber,
      computedRowsPerPageOptions,
      computedRowsNumber,

      firstPage,
      prevPage,
      nextPage,
      lastPage
    } = useTablePagination(
      vm,
      innerPagination,
      computedPagination,
      isServerSide,
      setPagination,
      filteredSortedRowsNumber
    )

    const nothingToDisplay = computed(() => computedRows.value.length === 0)

    const virtProps = computed(() => {
      const acc = {}

      commonVirtScrollPropsList.forEach(p => {
        acc[p] = props[p]
      })

      if (acc.virtualScrollItemSize === void 0) {
        acc.virtualScrollItemSize = props.dense ? 28 : 48
      }

      return acc
    })

    /**
     * Resets the virtual scroll (if using it) computations; Needed for custom edge-cases
     *
     * @api method resetVirtualScroll
     */
    function resetVirtualScroll() {
      if (hasVirtScroll.value) virtScrollRef.value.reset()
    }

    function getBody() {
      if (props.grid) return getGridBody()

      const header = props.hideHeader ? null : getTHead

      if (hasVirtScroll.value) {
        const topRow = slots['top-row']
        const bottomRow = slots['bottom-row']

        const virtSlots = {
          default: slotProps =>
            getTBodyTR(slotProps.item, slots.body, slotProps.index)
        }

        if (topRow !== void 0) {
          const topContent = h('tbody', topRow({ cols: computedCols.value }))
          virtSlots.before =
            header === null ? () => topContent : () => [header(), topContent]
        } else if (header !== null) {
          virtSlots.before = header
        }

        if (bottomRow !== void 0) {
          virtSlots.after = () =>
            h('tbody', bottomRow({ cols: computedCols.value }))
        }

        return h(
          QVirtualScroll,
          {
            ref: virtScrollRef,
            class: props.tableClass,
            style: props.tableStyle,
            ...virtProps.value,
            scrollTarget: props.virtualScrollTarget,
            items: computedRows.value,
            type: '__qtable',
            tableColspan: computedColspan.value,
            onVirtualScroll: onVScroll
          },
          virtSlots
        )
      }

      const child = [getTBody()]

      if (header !== null) {
        child.unshift(header())
      }

      return getTableMiddle(
        {
          class: ['q-table__middle scroll', props.tableClass],
          style: props.tableStyle
        },
        child
      )
    }

    /**
     * Scroll the table to the row with the specified index in page (0 based)
     *
     * @api method scrollTo
     * @param {Number|String} index The index of the row in page (0 based)
     * @param {String} edge Only for virtual scroll - the edge to align to if the row is not visible already; If the '-force' version is used then it always aligns; Default value: end (if scrolling towards the end) / start (if scrolling towards the start)
     */
    function scrollTo(toIndex, edge) {
      if (virtScrollRef.value !== null) {
        virtScrollRef.value.scrollTo(toIndex, edge)
        return
      }

      toIndex = Number.parseInt(toIndex, 10)
      const rowEl = rootRef.value.querySelector(
        `tbody tr:nth-of-type(${toIndex + 1})`
      )

      if (rowEl !== null) {
        const scrollTarget = rootRef.value.querySelector(
          '.q-table__middle.scroll'
        )
        const offsetTop = rowEl.offsetTop - props.virtualScrollStickySizeStart
        const direction =
          offsetTop < scrollTarget.scrollTop ? 'decrease' : 'increase'

        scrollTarget.scrollTop = offsetTop

        emit('virtualScroll', {
          index: toIndex,
          from: 0,
          to: innerPagination.value.rowsPerPage - 1,
          direction
        })
      }
    }

    function onVScroll(info) {
      emit('virtualScroll', info)
    }

    function getProgress() {
      return [
        h(QLinearProgress, {
          class: 'q-table__linear-progress',
          color: props.color,
          dark: isDark.value,
          indeterminate: true,
          trackColor: 'transparent'
        })
      ]
    }

    function getTBodyTR(row, bodySlot, pageIndex) {
      const key = getRowKey.value(row),
        selected = isRowSelected(key)

      if (bodySlot !== void 0) {
        const cfg = {
          key,
          row,
          pageIndex,
          __trClass: selected ? 'selected' : ''
        }

        if (props.tableRowStyleFn !== void 0) {
          cfg.__trStyle = props.tableRowStyleFn(row)
        }

        if (props.tableRowClassFn !== void 0) {
          const cls = props.tableRowClassFn(row)
          if (cls) {
            cfg.__trClass = `${cls} ${cfg.__trClass}`
          }
        }

        return bodySlot(getBodyScope(cfg))
      }

      const bodyCell = slots['body-cell'],
        child = computedCols.value.map(col => {
          const bodyCellCol = slots[`body-cell-${col.name}`],
            slot = bodyCellCol !== void 0 ? bodyCellCol : bodyCell

          return slot !== void 0
            ? slot(getBodyCellScope({ key, row, pageIndex, col }))
            : h(
                'td',
                {
                  class: col.__tdClass(row),
                  style: col.__tdStyle(row)
                },
                getCellValue(col, row)
              )
        })

      if (hasSelectionMode.value) {
        const slot = slots['body-selection']
        const content =
          slot !== void 0
            ? slot(getBodySelectionScope({ key, row, pageIndex }))
            : [
                h(QCheckbox, {
                  modelValue: selected,
                  color: props.color,
                  dark: isDark.value,
                  dense: props.dense,
                  'onUpdate:modelValue': (adding, evt) => {
                    updateSelection([key], [row], adding, evt)
                  }
                })
              ]

        child.unshift(h('td', { class: 'q-table--col-auto-width' }, content))
      }

      const data = { key, class: { selected } }

      if (props.onRowClick !== void 0) {
        data.class['cursor-pointer'] = true
        data.onClick = evt => {
          emit('rowClick', evt, row, pageIndex)
        }
      }

      if (props.onRowDblclick !== void 0) {
        data.class['cursor-pointer'] = true
        data.onDblclick = evt => {
          emit('rowDblclick', evt, row, pageIndex)
        }
      }

      if (props.onRowContextmenu !== void 0) {
        data.class['cursor-pointer'] = true
        data.onContextmenu = evt => {
          emit('rowContextmenu', evt, row, pageIndex)
        }
      }

      if (props.tableRowStyleFn !== void 0) {
        data.style = props.tableRowStyleFn(row)
      }

      if (props.tableRowClassFn !== void 0) {
        const cls = props.tableRowClassFn(row)
        if (cls) {
          data.class[cls] = true
        }
      }

      return h('tr', data, child)
    }

    function getTBody() {
      const body = slots.body,
        topRow = slots['top-row'],
        bottomRow = slots['bottom-row']

      const child = computedRows.value.map((row, pageIndex) =>
        getTBodyTR(row, body, pageIndex)
      )

      return h(
        'tbody',
        [
          topRow?.({ cols: computedCols.value }),
          ...child,
          bottomRow?.({ cols: computedCols.value })
        ].flat()
      )
    }

    function getBodyScope(data) {
      injectBodyCommonScope(data)

      data.cols = data.cols.map(col =>
        injectProp({ ...col }, 'value', () => getCellValue(col, data.row))
      )

      return data
    }

    function getBodyCellScope(data) {
      injectBodyCommonScope(data)
      injectProp(data, 'value', () => getCellValue(data.col, data.row))
      return data
    }

    function getBodySelectionScope(data) {
      injectBodyCommonScope(data)
      return data
    }

    function injectBodyCommonScope(data) {
      Object.assign(data, {
        cols: computedCols.value,
        colsMap: computedColsMap.value,
        sort,
        rowIndex: firstRowIndex.value + data.pageIndex,
        color: props.color,
        dark: isDark.value,
        dense: props.dense
      })

      if (hasSelectionMode.value) {
        injectProp(
          data,
          'selected',
          () => isRowSelected(data.key),
          (adding, evt) => {
            updateSelection([data.key], [data.row], adding, evt)
          }
        )
      }

      injectProp(
        data,
        'expand',
        () => isRowExpanded(data.key),
        adding => {
          updateExpanded(data.key, adding)
        }
      )
    }

    const marginalsScope = computed(() => ({
      pagination: computedPagination.value,
      pagesNumber: pagesNumber.value,
      isFirstPage: isFirstPage.value,
      isLastPage: isLastPage.value,
      firstPage,
      prevPage,
      nextPage,
      lastPage,

      inFullscreen: inFullscreen.value,
      toggleFullscreen
    }))

    function getTopDiv() {
      const top = slots.top,
        topLeft = slots['top-left'],
        topRight = slots['top-right'],
        topSelection = slots['top-selection'],
        hasSelection =
          hasSelectionMode.value &&
          topSelection !== void 0 &&
          rowsSelectedNumber.value > 0,
        topClass = 'q-table__top relative-position row items-center'

      if (top !== void 0) {
        return h('div', { class: topClass }, [top(marginalsScope.value)])
      }

      let child

      if (hasSelection) {
        child = [topSelection(marginalsScope.value)].flat()
      } else {
        child = []

        if (topLeft !== void 0) {
          child.push(
            h('div', { class: 'q-table__control' }, [
              topLeft(marginalsScope.value)
            ])
          )
        } else if (props.title) {
          child.push(
            h('div', { class: 'q-table__control' }, [
              h(
                'div',
                {
                  class: ['q-table__title', props.titleClass]
                },
                props.title
              )
            ])
          )
        }
      }

      if (topRight !== void 0) {
        child.push(
          h('div', { class: 'q-table__separator col' }),
          h('div', { class: 'q-table__control' }, [
            topRight(marginalsScope.value)
          ])
        )
      }

      if (child.length === 0) return
      return h('div', { class: topClass }, child)
    }

    const headerSelectedValue = computed(() =>
      someRowsSelected.value ? null : allRowsSelected.value
    )

    function getTHead() {
      const child = getTHeadTR()

      if (props.loading && slots.loading === void 0) {
        child.push(
          h('tr', { class: 'q-table__progress' }, [
            h(
              'th',
              {
                class: 'relative-position',
                colspan: computedColspan.value
              },
              getProgress()
            )
          ])
        )
      }

      return h('thead', child)
    }

    function getTHeadTR() {
      const header = slots.header,
        headerCell = slots['header-cell']

      if (header !== void 0) {
        return [header(getHeaderScope({ header: true }))].flat()
      }

      const child = computedCols.value.map(col => {
        const headerCellCol = slots[`header-cell-${col.name}`],
          slot = headerCellCol !== void 0 ? headerCellCol : headerCell,
          slotProps = getHeaderScope({ col })

        return slot !== void 0
          ? slot(slotProps)
          : h(
              QTh,
              {
                key: col.name,
                props: slotProps
              },
              () => col.label
            )
      })

      if (singleSelection.value && !props.grid) {
        child.unshift(h('th', { class: 'q-table--col-auto-width' }, ' '))
      } else if (multipleSelection.value) {
        const slot = slots['header-selection']
        const content =
          slot !== void 0
            ? slot(getHeaderScope({}))
            : [
                h(QCheckbox, {
                  color: props.color,
                  modelValue: headerSelectedValue.value,
                  dark: isDark.value,
                  dense: props.dense,
                  'onUpdate:modelValue': onMultipleSelectionSet
                })
              ]

        child.unshift(h('th', { class: 'q-table--col-auto-width' }, content))
      }

      return [
        h(
          'tr',
          {
            class: props.tableHeaderClass,
            style: props.tableHeaderStyle
          },
          child
        )
      ]
    }

    function getHeaderScope(data) {
      Object.assign(data, {
        cols: computedCols.value,
        sort,
        colsMap: computedColsMap.value,
        color: props.color,
        dark: isDark.value,
        dense: props.dense
      })

      if (multipleSelection.value) {
        injectProp(
          data,
          'selected',
          () => headerSelectedValue.value,
          onMultipleSelectionSet
        )
      }

      return data
    }

    function onMultipleSelectionSet(val) {
      if (someRowsSelected.value) val = false

      updateSelection(
        computedRows.value.map(getRowKey.value),
        computedRows.value,
        val
      )
    }

    const navIcon = computed(() => {
      const ico = [
        props.iconFirstPage || $q.iconSet.table.firstPage,
        props.iconPrevPage || $q.iconSet.table.prevPage,
        props.iconNextPage || $q.iconSet.table.nextPage,
        props.iconLastPage || $q.iconSet.table.lastPage
      ]
      return $q.lang.rtl ? ico.reverse() : ico
    })

    function getBottomDiv() {
      if (props.hideBottom) return

      if (nothingToDisplay.value) {
        if (props.hideNoData) return

        const message = props.loading
          ? props.loadingLabel || $q.lang.table.loading
          : props.filter
            ? props.noResultsLabel || $q.lang.table.noResults
            : props.noDataLabel || $q.lang.table.noData

        const noData = slots['no-data']
        const children =
          noData !== void 0
            ? [
                noData({
                  message,
                  icon: $q.iconSet.table.warning,
                  filter: props.filter
                })
              ]
            : [
                h(QIcon, {
                  class: 'q-table__bottom-nodata-icon',
                  name: $q.iconSet.table.warning
                }),
                message
              ]

        return h(
          'div',
          { class: bottomClass + ' q-table__bottom--nodata' },
          children
        )
      }

      const bottom = slots.bottom

      if (bottom !== void 0) {
        return h('div', { class: bottomClass }, [bottom(marginalsScope.value)])
      }

      const child =
        !props.hideSelectedBanner &&
        hasSelectionMode.value &&
        rowsSelectedNumber.value > 0
          ? [
              h('div', { class: 'q-table__control' }, [
                h('div', [
                  (props.selectedRowsLabel || $q.lang.table.selectedRecords)(
                    rowsSelectedNumber.value
                  )
                ])
              ])
            ]
          : []

      if (!props.hidePagination) {
        return h(
          'div',
          {
            class: bottomClass + ' justify-end'
          },
          getPaginationDiv(child)
        )
      }

      if (child.length !== 0) {
        return h('div', { class: bottomClass }, child)
      }
    }

    function onPagSelection(pag) {
      /**
       * Unless using an external pagination Object (through 'v-model:pagination' prop), you can use this method and force the internal pagination to change
       *
       * @api method setPagination
       * @param {Object} pagination Pagination object
       * @param {Boolean} forceServerRequest Also force a server request
       */
      setPagination({
        page: 1,
        rowsPerPage: pag.value
      })
    }

    function getPaginationDiv(child) {
      let control
      const { rowsPerPage } = computedPagination.value,
        paginationLabel = props.paginationLabel || $q.lang.table.pagination,
        paginationSlot = slots.pagination,
        hasOpts = props.rowsPerPageOptions.length > 1

      child.push(h('div', { class: 'q-table__separator col' }))

      if (hasOpts) {
        child.push(
          h('div', { class: 'q-table__control' }, [
            h('span', { class: 'q-table__bottom-item' }, [
              props.rowsPerPageLabel || $q.lang.table.recordsPerPage
            ]),
            h(QSelect, {
              class: 'q-table__select inline q-table__bottom-item',
              color: props.color,
              modelValue: rowsPerPage,
              options: computedRowsPerPageOptions.value,
              displayValue:
                rowsPerPage === 0 ? $q.lang.table.allRows : rowsPerPage,
              dark: isDark.value,
              borderless: true,
              dense: true,
              optionsDense: true,
              optionsCover: true,
              'onUpdate:modelValue': onPagSelection
            })
          ])
        )
      }

      if (paginationSlot !== void 0) {
        control = paginationSlot(marginalsScope.value)
      } else {
        control = [
          h(
            'span',
            rowsPerPage !== 0 ? { class: 'q-table__bottom-item' } : {},
            [
              rowsPerPage
                ? paginationLabel(
                    firstRowIndex.value + 1,
                    Math.min(lastRowIndex.value, computedRowsNumber.value),
                    computedRowsNumber.value
                  )
                : paginationLabel(
                    1,
                    filteredSortedRowsNumber.value,
                    computedRowsNumber.value
                  )
            ]
          )
        ]

        if (rowsPerPage !== 0 && pagesNumber.value > 1) {
          const btnProps = {
            color: props.color,
            round: true,
            dense: true,
            flat: true
          }

          if (props.dense) {
            btnProps.size = 'sm'
          }

          if (pagesNumber.value > 2) {
            control.push(
              h(QBtn, {
                key: 'pgFirst',
                ...btnProps,
                icon: navIcon.value[0],
                disable: isFirstPage.value,
                'aria-label': $q.lang.pagination.first,
                onClick: firstPage
              })
            )
          }

          control.push(
            h(QBtn, {
              key: 'pgPrev',
              ...btnProps,
              icon: navIcon.value[1],
              disable: isFirstPage.value,
              'aria-label': $q.lang.pagination.prev,
              onClick: prevPage
            }),

            h(QBtn, {
              key: 'pgNext',
              ...btnProps,
              icon: navIcon.value[2],
              disable: isLastPage.value,
              'aria-label': $q.lang.pagination.next,
              onClick: nextPage
            })
          )

          if (pagesNumber.value > 2) {
            control.push(
              h(QBtn, {
                key: 'pgLast',
                ...btnProps,
                icon: navIcon.value[3],
                disable: isLastPage.value,
                'aria-label': $q.lang.pagination.last,
                onClick: lastPage
              })
            )
          }
        }
      }

      child.push(h('div', { class: 'q-table__control' }, control))

      return child
    }

    function getGridHeader() {
      const child = props.gridHeader
        ? [h('table', { class: 'q-table' }, [getTHead(h)])]
        : props.loading && slots.loading === void 0
          ? getProgress(h)
          : void 0

      return h('div', { class: 'q-table__middle' }, child)
    }

    function getGridBody() {
      const item =
        slots.item !== void 0
          ? slots.item
          : scope => {
              const child = scope.cols.map(col =>
                h('div', { class: 'q-table__grid-item-row' }, [
                  h('div', { class: 'q-table__grid-item-title' }, [col.label]),
                  h('div', { class: 'q-table__grid-item-value' }, [col.value])
                ])
              )

              if (hasSelectionMode.value) {
                const slot = slots['body-selection']
                const content =
                  slot !== void 0
                    ? slot(scope)
                    : [
                        h(QCheckbox, {
                          modelValue: scope.selected,
                          color: props.color,
                          dark: isDark.value,
                          dense: props.dense,
                          'onUpdate:modelValue': (adding, evt) => {
                            updateSelection(
                              [scope.key],
                              [scope.row],
                              adding,
                              evt
                            )
                          }
                        })
                      ]

                child.unshift(
                  h('div', { class: 'q-table__grid-item-row' }, content),
                  h(QSeparator, { dark: isDark.value })
                )
              }

              const data = {
                class: [
                  'q-table__grid-item-card' + cardDefaultClass.value,
                  props.cardClass
                ],
                style: props.cardStyle
              }

              if (props.cardStyleFn !== void 0) {
                data.style = [data.style, props.cardStyleFn(scope.row)]
              }

              if (props.cardClassFn !== void 0) {
                const cls = props.cardClassFn(scope.row)
                if (cls) {
                  data.class[0] += ` ${cls}`
                }
              }

              if (
                props.onRowClick !== void 0 ||
                props.onRowDblclick !== void 0 ||
                props.onRowContextmenu !== void 0
              ) {
                data.class[0] += ' cursor-pointer'

                if (props.onRowClick !== void 0) {
                  data.onClick = evt => {
                    emit('RowClick', evt, scope.row, scope.pageIndex)
                  }
                }

                if (props.onRowDblclick !== void 0) {
                  data.onDblclick = evt => {
                    emit('RowDblclick', evt, scope.row, scope.pageIndex)
                  }
                }

                if (props.onRowContextmenu !== void 0) {
                  data.onContextmenu = evt => {
                    emit('rowContextmenu', evt, scope.row, scope.pageIndex)
                  }
                }
              }

              return h(
                'div',
                {
                  class:
                    'q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3' +
                    (scope.selected ? ' q-table__grid-item--selected' : '')
                },
                [h('div', data, child)]
              )
            }

      return h(
        'div',
        {
          class: ['q-table__grid-content row', props.cardContainerClass],
          style: props.cardContainerStyle
        },
        computedRows.value.map((row, pageIndex) =>
          item(
            getBodyScope({
              key: getRowKey.value(row),
              row,
              pageIndex
            })
          )
        )
      )
    }

    // expose public methods and needed computed props
    Object.assign(vm.proxy, {
      requestServerInteraction,
      setPagination,
      firstPage,
      prevPage,
      nextPage,
      lastPage,
      isRowSelected,
      clearSelection,
      isRowExpanded,
      setExpanded,
      sort,
      resetVirtualScroll,
      scrollTo,
      getCellValue
    })

    injectMultipleProps(vm.proxy, {
      filteredSortedRows: () => filteredSortedRows.value,
      computedRows: () => computedRows.value,
      computedRowsNumber: () => computedRowsNumber.value
    })

    return () => {
      const child = [getTopDiv()]
      const data = { ref: rootRef, class: rootContainerClass.value }

      if (props.grid) {
        child.push(getGridHeader())
      } else {
        Object.assign(data, {
          class: [data.class, props.cardClass],
          style: props.cardStyle
        })
      }

      child.push(getBody(), getBottomDiv())

      if (props.loading && slots.loading !== void 0) {
        child.push(slots.loading())
      }

      return h('div', data, child)
    }
  }
})
