import { computed, nextTick, ref, watch } from 'vue'

function samePagination(oldPag, newPag) {
  for (const prop in newPag) {
    if (newPag[prop] !== oldPag[prop]) {
      return false
    }
  }
  return true
}

function fixPagination(p) {
  if (p.page < 1) {
    p.page = 1
  }
  if (p.rowsPerPage !== void 0 && p.rowsPerPage < 1) {
    p.rowsPerPage = 0
  }
  return p
}

export const useTablePaginationProps = {
  /**
   * Pagination object; When not using the .sync modifier, it simply initializes the pagination on first render
   *
   * @api prop pagination
   * @type {Object}
   * @category pagination
   * @syncable
   */
  pagination: Object,

  /**
   * Options to offer the user for number of rows per page
   *
   * @api prop rows-per-page-options
   * @type {Array}
   * @default [5, 7, 10, 15, 20, 25, 50, 0]
   * @category pagination
   */
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 7, 10, 15, 20, 25, 50, 0]
  },

  /**
   * Emitted when pagination changes
   *
   * @api event update:pagination
   * @param {Object} newPagination New pagination object
   */
  'onUpdate:pagination': [Function, Array]
}

export function useTablePaginationState(vm, getCellValue) {
  const { props, emit } = vm

  const innerPagination = ref({
    sortBy: null,
    descending: false,
    page: 1,
    rowsPerPage:
      props.rowsPerPageOptions.length !== 0 ? props.rowsPerPageOptions[0] : 5,
    ...props.pagination
  })

  const computedPagination = computed(() => {
    const pag =
      props['onUpdate:pagination'] !== void 0
        ? { ...innerPagination.value, ...props.pagination }
        : innerPagination.value

    return fixPagination(pag)
  })

  const isServerSide = computed(
    () => computedPagination.value.rowsNumber !== void 0
  )

  function sendServerRequest(pagination) {
    requestServerInteraction({
      pagination,
      filter: props.filter
    })
  }

  /**
   * Trigger a server request
   *
   * @api method requestServerInteraction
   * @param {Object} [prop] Optional pagination/filter override
   */
  function requestServerInteraction(prop = {}) {
    nextTick(() => {
      emit('request', {
        pagination: prop.pagination || computedPagination.value,
        filter: prop.filter || props.filter,
        getCellValue
      })
    })
  }

  function setPagination(val, forceServerRequest) {
    const newPagination = fixPagination({
      ...computedPagination.value,
      ...val
    })

    if (samePagination(computedPagination.value, newPagination)) {
      if (isServerSide.value && forceServerRequest) {
        sendServerRequest(newPagination)
      }
      return
    }

    if (isServerSide.value) {
      sendServerRequest(newPagination)
      return
    }

    if (
      props.pagination !== void 0 &&
      props['onUpdate:pagination'] !== void 0
    ) {
      emit('update:pagination', newPagination)
    } else {
      innerPagination.value = newPagination
    }
  }

  return {
    innerPagination,
    computedPagination,
    isServerSide,

    requestServerInteraction,
    setPagination
  }
}

export function useTablePagination(
  vm,
  innerPagination,
  computedPagination,
  isServerSide,
  setPagination,
  filteredSortedRowsNumber
) {
  const {
    props,
    emit,
    proxy: { $q }
  } = vm

  const computedRowsNumber = computed(() =>
    isServerSide.value
      ? computedPagination.value.rowsNumber || 0
      : filteredSortedRowsNumber.value
  )

  const firstRowIndex = computed(() => {
    const { page, rowsPerPage } = computedPagination.value
    return (page - 1) * rowsPerPage
  })

  const lastRowIndex = computed(() => {
    const { page, rowsPerPage } = computedPagination.value
    return page * rowsPerPage
  })

  const isFirstPage = computed(() => computedPagination.value.page === 1)

  const pagesNumber = computed(() =>
    computedPagination.value.rowsPerPage === 0
      ? 1
      : Math.max(
          1,
          Math.ceil(
            computedRowsNumber.value / computedPagination.value.rowsPerPage
          )
        )
  )

  const isLastPage = computed(() =>
    lastRowIndex.value === 0
      ? true
      : computedPagination.value.page >= pagesNumber.value
  )

  const computedRowsPerPageOptions = computed(() => {
    const opts = props.rowsPerPageOptions.includes(
      innerPagination.value.rowsPerPage
    )
      ? props.rowsPerPageOptions
      : [innerPagination.value.rowsPerPage, ...props.rowsPerPageOptions]

    return opts.map(count => ({
      label: count === 0 ? $q.lang.table.allRows : String(count),
      value: count
    }))
  })

  watch(pagesNumber, (newLastPage, oldLastPage) => {
    if (newLastPage === oldLastPage) return

    const currentPage = computedPagination.value.page
    if (newLastPage && !currentPage) {
      setPagination({ page: 1 })
    } else if (newLastPage < currentPage) {
      setPagination({ page: newLastPage })
    }
  })

  /**
   * Navigates to first page
   *
   * @api method firstPage
   */
  function firstPage() {
    setPagination({ page: 1 })
  }

  /**
   * Navigates to previous page, if available
   *
   * @api method prevPage
   */
  function prevPage() {
    const { page } = computedPagination.value
    if (page > 1) {
      setPagination({ page: page - 1 })
    }
  }

  /**
   * Navigates to next page, if available
   *
   * @api method nextPage
   */
  function nextPage() {
    const { page, rowsPerPage } = computedPagination.value
    if (
      lastRowIndex.value > 0 &&
      page * rowsPerPage < computedRowsNumber.value
    ) {
      setPagination({ page: page + 1 })
    }
  }

  /**
   * Navigates to last page
   *
   * @api method lastPage
   */
  function lastPage() {
    setPagination({ page: pagesNumber.value })
  }

  if (props['onUpdate:pagination'] !== void 0) {
    emit('update:pagination', { ...computedPagination.value })
  }

  return {
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
  }
}
