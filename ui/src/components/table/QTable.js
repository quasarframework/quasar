import { h, ref, computed, watch, getCurrentInstance } from 'vue'

import QTh from './QTh.js'

import QSeparator from '../separator/QSeparator.js'
import QIcon from '../icon/QIcon.js'
import QVirtualScroll from '../virtual-scroll/QVirtualScroll.js'
import QSelect from '../select/QSelect.js'
import QLinearProgress from '../linear-progress/QLinearProgress.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QBtn from '../btn/QBtn.js'

import getTableMiddle from './get-table-middle.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import { commonVirtPropsList } from '../virtual-scroll/use-virtual-scroll.js'
import useFullscreen, { useFullscreenProps, useFullscreenEmits } from '../../composables/private/use-fullscreen.js'

import { useTableSort, useTableSortProps } from './table-sort.js'
import { useTableFilter, useTableFilterProps } from './table-filter.js'
import { useTablePaginationState, useTablePagination, useTablePaginationProps } from './table-pagination.js'
import { useTableRowSelection, useTableRowSelectionProps, useTableRowSelectionEmits } from './table-row-selection.js'
import { useTableRowExpand, useTableRowExpandProps, useTableRowExpandEmits } from './table-row-expand.js'
import { useTableColumnSelection, useTableColumnSelectionProps } from './table-column-selection.js'

import { injectProp, injectMultipleProps } from '../../utils/private/inject-obj-prop.js'
import { createComponent } from '../../utils/private/create.js'

const bottomClass = 'q-table__bottom row items-center'

const commonVirtPropsObj = {}
commonVirtPropsList.forEach(p => { commonVirtPropsObj[ p ] = {} })

export default createComponent({
  name: 'QTable',

  props: {
    rows: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: [ String, Function ],
      default: 'id'
    },

    columns: Array,
    loading: Boolean,

    iconFirstPage: String,
    iconPrevPage: String,
    iconNextPage: String,
    iconLastPage: String,

    title: String,

    hideHeader: Boolean,

    grid: Boolean,
    gridHeader: Boolean,

    dense: Boolean,
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => [ 'horizontal', 'vertical', 'cell', 'none' ].includes(v)
    },
    wrapCells: Boolean,

    virtualScroll: Boolean,
    virtualScrollTarget: {
      default: void 0
    },
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

    titleClass: [ String, Array, Object ],
    tableStyle: [ String, Array, Object ],
    tableClass: [ String, Array, Object ],
    tableHeaderStyle: [ String, Array, Object ],
    tableHeaderClass: [ String, Array, Object ],
    cardContainerClass: [ String, Array, Object ],
    cardContainerStyle: [ String, Array, Object ],
    cardStyle: [ String, Array, Object ],
    cardClass: [ String, Array, Object ],

    hideBottom: Boolean,
    hideSelectedBanner: Boolean,
    hideNoData: Boolean,
    hidePagination: Boolean,

    onRowClick: Function,
    onRowDblclick: Function,
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
    'request', 'virtualScroll',
    ...useFullscreenEmits,
    ...useTableRowExpandEmits,
    ...useTableRowSelectionEmits
  ],

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance()
    const { proxy: { $q } } = vm

    const isDark = useDark(props, $q)
    const { inFullscreen, toggleFullscreen } = useFullscreen()

    const getRowKey = computed(() => (
      typeof props.rowKey === 'function'
        ? props.rowKey
        : row => row[ props.rowKey ]
    ))

    const rootRef = ref(null)
    const virtScrollRef = ref(null)
    const hasVirtScroll = computed(() => props.grid !== true && props.virtualScroll === true)

    const cardDefaultClass = computed(() =>
      ' q-table__card'
      + (isDark.value === true ? ' q-table__card--dark q-dark' : '')
      + (props.square === true ? ' q-table--square' : '')
      + (props.flat === true ? ' q-table--flat' : '')
      + (props.bordered === true ? ' q-table--bordered' : '')
    )

    const __containerClass = computed(() =>
      `q-table__container q-table--${ props.separator }-separator column no-wrap`
      + (props.grid === true ? ' q-table--grid' : cardDefaultClass.value)
      + (isDark.value === true ? ' q-table--dark' : '')
      + (props.dense === true ? ' q-table--dense' : '')
      + (props.wrapCells === false ? ' q-table--no-wrap' : '')
      + (inFullscreen.value === true ? ' fullscreen scroll' : '')
    )

    const containerClass = computed(() =>
      __containerClass.value + (props.loading === true ? ' q-table--loading' : '')
    )

    watch(
      () => props.tableStyle + props.tableClass + props.tableHeaderStyle + props.tableHeaderClass + __containerClass.value,
      () => { hasVirtScroll.value === true && virtScrollRef.value !== null && virtScrollRef.value.reset() }
    )

    const {
      innerPagination,
      computedPagination,
      isServerSide,

      requestServerInteraction,
      setPagination
    } = useTablePaginationState(vm, getCellValue)

    const { computedFilterMethod } = useTableFilter(props, setPagination)
    const { isRowExpanded, setExpanded, updateExpanded } = useTableRowExpand(props, emit)

    const filteredSortedRows = computed(() => {
      let rows = props.rows

      if (isServerSide.value === true || rows.length === 0) {
        return rows
      }

      const { sortBy, descending } = computedPagination.value

      if (props.filter) {
        rows = computedFilterMethod.value(rows, props.filter, computedCols.value, getCellValue)
      }

      if (columnToSort.value !== null) {
        rows = computedSortMethod.value(
          props.rows === rows ? rows.slice() : rows,
          sortBy,
          descending
        )
      }

      return rows
    })

    const filteredSortedRowsNumber = computed(() => filteredSortedRows.value.length)

    const computedRows = computed(() => {
      let rows = filteredSortedRows.value

      if (isServerSide.value === true) {
        return rows
      }

      const { rowsPerPage } = computedPagination.value

      if (rowsPerPage !== 0) {
        if (firstRowIndex.value === 0 && props.rows !== rows) {
          if (rows.length > lastRowIndex.value) {
            rows = rows.slice(0, lastRowIndex.value)
          }
        }
        else {
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

    const { colList, computedCols, computedColsMap, computedColspan } = useTableColumnSelection(props, computedPagination, hasSelectionMode)

    const { columnToSort, computedSortMethod, sort } = useTableSort(props, computedPagination, colList, setPagination)

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
    } = useTablePagination(vm, innerPagination, computedPagination, isServerSide, setPagination, filteredSortedRowsNumber)

    const nothingToDisplay = computed(() => computedRows.value.length === 0)

    const virtProps = computed(() => {
      const acc = {}

      commonVirtPropsList
        .forEach(p => { acc[ p ] = props[ p ] })

      if (acc.virtualScrollItemSize === void 0) {
        acc.virtualScrollItemSize = props.dense === true ? 28 : 48
      }

      return acc
    })

    function resetVirtualScroll () {
      hasVirtScroll.value === true && virtScrollRef.value.reset()
    }

    function getBody () {
      if (props.grid === true) {
        return getGridBody()
      }

      const header = props.hideHeader !== true ? getTHead : null

      if (hasVirtScroll.value === true) {
        const topRow = slots[ 'top-row' ]
        const bottomRow = slots[ 'bottom-row' ]

        const virtSlots = {
          default: props => getTBodyTR(props.item, slots.body, props.index)
        }

        if (topRow !== void 0) {
          const topContent = h('tbody', topRow({ cols: computedCols.value }))

          virtSlots.before = header === null
            ? () => topContent
            : () => [ header() ].concat(topContent)
        }
        else if (header !== null) {
          virtSlots.before = header
        }

        if (bottomRow !== void 0) {
          virtSlots.after = () => h('tbody', bottomRow({ cols: computedCols.value }))
        }

        return h(QVirtualScroll, {
          ref: virtScrollRef,
          class: props.tableClass,
          style: props.tableStyle,
          ...virtProps.value,
          scrollTarget: props.virtualScrollTarget,
          items: computedRows.value,
          type: '__qtable',
          tableColspan: computedColspan.value,
          onVirtualScroll: onVScroll
        }, virtSlots)
      }

      const child = [
        getTBody()
      ]

      if (header !== null) {
        child.unshift(header())
      }

      return getTableMiddle({
        class: [ 'q-table__middle scroll', props.tableClass ],
        style: props.tableStyle
      }, child)
    }

    function scrollTo (toIndex, edge) {
      if (virtScrollRef.value !== null) {
        virtScrollRef.value.scrollTo(toIndex, edge)
        return
      }

      toIndex = parseInt(toIndex, 10)
      const rowEl = rootRef.value.querySelector(`tbody tr:nth-of-type(${ toIndex + 1 })`)

      if (rowEl !== null) {
        const scrollTarget = rootRef.value.querySelector('.q-table__middle.scroll')
        const offsetTop = rowEl.offsetTop - props.virtualScrollStickySizeStart
        const direction = offsetTop < scrollTarget.scrollTop ? 'decrease' : 'increase'

        scrollTarget.scrollTop = offsetTop

        emit('virtualScroll', {
          index: toIndex,
          from: 0,
          to: innerPagination.value.rowsPerPage - 1,
          direction
        })
      }
    }

    function onVScroll (info) {
      emit('virtualScroll', info)
    }

    function getProgress () {
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

    function getTBodyTR (row, bodySlot, pageIndex) {
      const
        key = getRowKey.value(row),
        selected = isRowSelected(key)

      if (bodySlot !== void 0) {
        return bodySlot(
          getBodyScope({
            key,
            row,
            pageIndex,
            __trClass: selected ? 'selected' : ''
          })
        )
      }

      const
        bodyCell = slots[ 'body-cell' ],
        child = computedCols.value.map(col => {
          const
            bodyCellCol = slots[ `body-cell-${ col.name }` ],
            slot = bodyCellCol !== void 0 ? bodyCellCol : bodyCell

          return slot !== void 0
            ? slot(getBodyCellScope({ key, row, pageIndex, col }))
            : h('td', {
              class: col.__tdClass(row),
              style: col.__tdStyle(row)
            }, getCellValue(col, row))
        })

      if (hasSelectionMode.value === true) {
        const slot = slots[ 'body-selection' ]
        const content = slot !== void 0
          ? slot(getBodySelectionScope({ key, row, pageIndex }))
          : [
              h(QCheckbox, {
                modelValue: selected,
                color: props.color,
                dark: isDark.value,
                dense: props.dense,
                'onUpdate:modelValue': (adding, evt) => {
                  updateSelection([ key ], [ row ], adding, evt)
                }
              })
            ]

        child.unshift(
          h('td', { class: 'q-table--col-auto-width' }, content)
        )
      }

      const data = { key, class: { selected } }

      if (props.onRowClick !== void 0) {
        data.class[ 'cursor-pointer' ] = true
        data.onClick = evt => {
          emit('RowClick', evt, row, pageIndex)
        }
      }

      if (props.onRowDblclick !== void 0) {
        data.class[ 'cursor-pointer' ] = true
        data.onDblclick = evt => {
          emit('RowDblclick', evt, row, pageIndex)
        }
      }

      if (props.onRowContextmenu !== void 0) {
        data.class[ 'cursor-pointer' ] = true
        data.onContextmenu = evt => {
          emit('RowContextmenu', evt, row, pageIndex)
        }
      }

      return h('tr', data, child)
    }

    function getTBody () {
      const
        body = slots.body,
        topRow = slots[ 'top-row' ],
        bottomRow = slots[ 'bottom-row' ]

      let child = computedRows.value.map(
        (row, pageIndex) => getTBodyTR(row, body, pageIndex)
      )

      if (topRow !== void 0) {
        child = topRow({ cols: computedCols.value }).concat(child)
      }
      if (bottomRow !== void 0) {
        child = child.concat(bottomRow({ cols: computedCols.value }))
      }

      return h('tbody', child)
    }

    function getBodyScope (data) {
      injectBodyCommonScope(data)

      data.cols = data.cols.map(
        col => injectProp({ ...col }, 'value', () => getCellValue(col, data.row))
      )

      return data
    }

    function getBodyCellScope (data) {
      injectBodyCommonScope(data)
      injectProp(data, 'value', () => getCellValue(data.col, data.row))
      return data
    }

    function getBodySelectionScope (data) {
      injectBodyCommonScope(data)
      return data
    }

    function injectBodyCommonScope (data) {
      Object.assign(data, {
        cols: computedCols.value,
        colsMap: computedColsMap.value,
        sort,
        rowIndex: firstRowIndex.value + data.pageIndex,
        color: props.color,
        dark: isDark.value,
        dense: props.dense
      })

      hasSelectionMode.value === true && injectProp(
        data,
        'selected',
        () => isRowSelected(data.key),
        (adding, evt) => {
          updateSelection([ data.key ], [ data.row ], adding, evt)
        }
      )

      injectProp(
        data,
        'expand',
        () => isRowExpanded(data.key),
        adding => { updateExpanded(data.key, adding) }
      )
    }

    function getCellValue (col, row) {
      const val = typeof col.field === 'function' ? col.field(row) : row[ col.field ]
      return col.format !== void 0 ? col.format(val, row) : val
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

    function getTopDiv () {
      const
        top = slots.top,
        topLeft = slots[ 'top-left' ],
        topRight = slots[ 'top-right' ],
        topSelection = slots[ 'top-selection' ],
        hasSelection = hasSelectionMode.value === true
          && topSelection !== void 0
          && rowsSelectedNumber.value > 0,
        topClass = 'q-table__top relative-position row items-center'

      if (top !== void 0) {
        return h('div', { class: topClass }, [ top(marginalsScope.value) ])
      }

      let child

      if (hasSelection === true) {
        child = topSelection(marginalsScope.value).slice()
      }
      else {
        child = []

        if (topLeft !== void 0) {
          child.push(
            h('div', { class: 'q-table__control' }, [
              topLeft(marginalsScope.value)
            ])
          )
        }
        else if (props.title) {
          child.push(
            h('div', { class: 'q-table__control' }, [
              h('div', {
                class: [ 'q-table__title', props.titleClass ]
              }, props.title)
            ])
          )
        }
      }

      if (topRight !== void 0) {
        child.push(
          h('div', { class: 'q-table__separator col' })
        )
        child.push(
          h('div', { class: 'q-table__control' }, [
            topRight(marginalsScope.value)
          ])
        )
      }

      if (child.length === 0) {
        return
      }

      return h('div', { class: topClass }, child)
    }

    const headerSelectedValue = computed(() => (
      someRowsSelected.value === true
        ? null
        : allRowsSelected.value
    ))

    function getTHead () {
      const child = getTHeadTR()

      if (props.loading === true && slots.loading === void 0) {
        child.push(
          h('tr', { class: 'q-table__progress' }, [
            h('th', {
              class: 'relative-position',
              colspan: computedColspan.value
            }, getProgress())
          ])
        )
      }

      return h('thead', child)
    }

    function getTHeadTR () {
      const
        header = slots.header,
        headerCell = slots[ 'header-cell' ]

      if (header !== void 0) {
        return header(
          getHeaderScope({ header: true })
        ).slice()
      }

      const child = computedCols.value.map(col => {
        const
          headerCellCol = slots[ `header-cell-${ col.name }` ],
          slot = headerCellCol !== void 0 ? headerCellCol : headerCell,
          props = getHeaderScope({ col })

        return slot !== void 0
          ? slot(props)
          : h(QTh, {
            key: col.name,
            props
          }, () => col.label)
      })

      if (singleSelection.value === true && props.grid !== true) {
        child.unshift(
          h('th', { class: 'q-table--col-auto-width' }, ' ')
        )
      }
      else if (multipleSelection.value === true) {
        const slot = slots[ 'header-selection' ]
        const content = slot !== void 0
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

        child.unshift(
          h('th', { class: 'q-table--col-auto-width' }, content)
        )
      }

      return [
        h('tr', {
          class: props.tableHeaderClass,
          style: props.tableHeaderStyle
        }, child)
      ]
    }

    function getHeaderScope (data) {
      Object.assign(data, {
        cols: computedCols.value,
        sort,
        colsMap: computedColsMap.value,
        color: props.color,
        dark: isDark.value,
        dense: props.dense
      })

      if (multipleSelection.value === true) {
        injectProp(
          data,
          'selected',
          () => headerSelectedValue.value,
          onMultipleSelectionSet
        )
      }

      return data
    }

    function onMultipleSelectionSet (val) {
      if (someRowsSelected.value === true) {
        val = false
      }

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
      return $q.lang.rtl === true ? ico.reverse() : ico
    })

    function getBottomDiv () {
      if (props.hideBottom === true) {
        return
      }

      if (nothingToDisplay.value === true) {
        if (props.hideNoData === true) {
          return
        }

        const message = props.loading === true
          ? props.loadingLabel || $q.lang.table.loading
          : (props.filter ? props.noResultsLabel || $q.lang.table.noResults : props.noDataLabel || $q.lang.table.noData)

        const noData = slots[ 'no-data' ]
        const children = noData !== void 0
          ? [ noData({ message, icon: $q.iconSet.table.warning, filter: props.filter }) ]
          : [
              h(QIcon, {
                class: 'q-table__bottom-nodata-icon',
                name: $q.iconSet.table.warning
              }),
              message
            ]

        return h('div', { class: bottomClass + ' q-table__bottom--nodata' }, children)
      }

      const bottom = slots.bottom

      if (bottom !== void 0) {
        return h('div', { class: bottomClass }, [ bottom(marginalsScope.value) ])
      }

      const child = props.hideSelectedBanner !== true && hasSelectionMode.value === true && rowsSelectedNumber.value > 0
        ? [
            h('div', { class: 'q-table__control' }, [
              h('div', [
                (props.selectedRowsLabel || $q.lang.table.selectedRecords)(rowsSelectedNumber.value)
              ])
            ])
          ]
        : []

      if (props.hidePagination !== true) {
        return h('div', {
          class: bottomClass + ' justify-end'
        }, getPaginationDiv(child))
      }

      if (child.length !== 0) {
        return h('div', { class: bottomClass }, child)
      }
    }

    function onPagSelection (pag) {
      setPagination({
        page: 1,
        rowsPerPage: pag.value
      })
    }

    function getPaginationDiv (child) {
      let control
      const
        { rowsPerPage } = computedPagination.value,
        paginationLabel = props.paginationLabel || $q.lang.table.pagination,
        paginationSlot = slots.pagination,
        hasOpts = props.rowsPerPageOptions.length > 1

      child.push(
        h('div', { class: 'q-table__separator col' })
      )

      if (hasOpts === true) {
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
              displayValue: rowsPerPage === 0
                ? $q.lang.table.allRows
                : rowsPerPage,
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
      }
      else {
        control = [
          h('span', rowsPerPage !== 0 ? { class: 'q-table__bottom-item' } : {}, [
            rowsPerPage
              ? paginationLabel(firstRowIndex.value + 1, Math.min(lastRowIndex.value, computedRowsNumber.value), computedRowsNumber.value)
              : paginationLabel(1, filteredSortedRowsNumber.value, computedRowsNumber.value)
          ])
        ]

        if (rowsPerPage !== 0 && pagesNumber.value > 1) {
          const btnProps = {
            color: props.color,
            round: true,
            dense: true,
            flat: true
          }

          if (props.dense === true) {
            btnProps.size = 'sm'
          }

          pagesNumber.value > 2 && control.push(
            h(QBtn, {
              key: 'pgFirst',
              ...btnProps,
              icon: navIcon.value[ 0 ],
              disable: isFirstPage.value,
              onClick: firstPage
            })
          )

          control.push(
            h(QBtn, {
              key: 'pgPrev',
              ...btnProps,
              icon: navIcon.value[ 1 ],
              disable: isFirstPage.value,
              onClick: prevPage
            }),

            h(QBtn, {
              key: 'pgNext',
              ...btnProps,
              icon: navIcon.value[ 2 ],
              disable: isLastPage.value,
              onClick: nextPage
            })
          )

          pagesNumber.value > 2 && control.push(
            h(QBtn, {
              key: 'pgLast',
              ...btnProps,
              icon: navIcon.value[ 3 ],
              disable: isLastPage.value,
              onClick: lastPage
            })
          )
        }
      }

      child.push(
        h('div', { class: 'q-table__control' }, control)
      )

      return child
    }

    function getGridHeader () {
      const child = props.gridHeader === true
        ? [
            h('table', { class: 'q-table' }, [
              getTHead(h)
            ])
          ]
        : (
            props.loading === true && slots.loading === void 0
              ? getProgress(h)
              : void 0
          )

      return h('div', { class: 'q-table__middle' }, child)
    }

    function getGridBody () {
      const item = slots.item !== void 0
        ? slots.item
        : scope => {
          const child = scope.cols.map(
            col => h('div', { class: 'q-table__grid-item-row' }, [
              h('div', { class: 'q-table__grid-item-title' }, [ col.label ]),
              h('div', { class: 'q-table__grid-item-value' }, [ col.value ])
            ])
          )

          if (hasSelectionMode.value === true) {
            const slot = slots[ 'body-selection' ]
            const content = slot !== void 0
              ? slot(scope)
              : [
                  h(QCheckbox, {
                    modelValue: scope.selected,
                    color: props.color,
                    dark: isDark.value,
                    dense: props.dense,
                    'onUpdate:modelValue': (adding, evt) => {
                      updateSelection([ scope.key ], [ scope.row ], adding, evt)
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

          if (
            props.onRowClick !== void 0
            || props.onRowDblclick !== void 0
          ) {
            data.class[ 0 ] += ' cursor-pointer'

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
          }

          return h('div', {
            class: 'q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3'
              + (scope.selected === true ? ' q-table__grid-item--selected' : '')
          }, [
            h('div', data, child)
          ])
        }

      return h('div', {
        class: [
          'q-table__grid-content row',
          props.cardContainerClass
        ],
        style: props.cardContainerStyle
      }, computedRows.value.map((row, pageIndex) => {
        return item(getBodyScope({
          key: getRowKey.value(row),
          row,
          pageIndex
        }))
      }))
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
      const child = [ getTopDiv() ]
      const data = { ref: rootRef, class: containerClass.value }

      if (props.grid === true) {
        child.push(getGridHeader())
      }
      else {
        Object.assign(data, {
          class: [ data.class, props.cardClass ],
          style: props.cardStyle
        })
      }

      child.push(
        getBody(),
        getBottomDiv()
      )

      if (props.loading === true && slots.loading !== void 0) {
        child.push(
          slots.loading()
        )
      }

      return h('div', data, child)
    }
  }
})
