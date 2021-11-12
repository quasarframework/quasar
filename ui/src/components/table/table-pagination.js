import { ref, computed, watch, nextTick } from 'vue'

function samePagination (oldPag, newPag) {
  for (const prop in newPag) {
    if (newPag[ prop ] !== oldPag[ prop ]) {
      return false
    }
  }
  return true
}

function fixPagination (p) {
  if (p.page < 1) {
    p.page = 1
  }
  if (p.rowsPerPage !== void 0 && p.rowsPerPage < 1) {
    p.rowsPerPage = 0
  }
  return p
}

export const useTablePaginationProps = {
  pagination: Object,
  rowsPerPageOptions: {
    type: Array,
    default: () => [ 5, 7, 10, 15, 20, 25, 50, 0 ]
  },

  'onUpdate:pagination': [ Function, Array ]
}

export function useTablePaginationState (vm, getCellValue) {
  const { props, emit } = vm

  const innerPagination = ref(
    Object.assign({
      sortBy: null,
      descending: false,
      page: 1,
      rowsPerPage: props.rowsPerPageOptions.length > 0
        ? props.rowsPerPageOptions[ 0 ]
        : 5
    }, props.pagination)
  )

  const computedPagination = computed(() => {
    const pag = props[ 'onUpdate:pagination' ] !== void 0
      ? { ...innerPagination.value, ...props.pagination }
      : innerPagination.value

    return fixPagination(pag)
  })

  const isServerSide = computed(() => computedPagination.value.rowsNumber !== void 0)

  function sendServerRequest (pagination) {
    requestServerInteraction({
      pagination,
      filter: props.filter
    })
  }

  function requestServerInteraction (prop = {}) {
    nextTick(() => {
      emit('request', {
        pagination: prop.pagination || computedPagination.value,
        filter: prop.filter || props.filter,
        getCellValue
      })
    })
  }

  function setPagination (val, forceServerRequest) {
    const newPagination = fixPagination({
      ...computedPagination.value,
      ...val
    })

    if (samePagination(computedPagination.value, newPagination) === true) {
      if (isServerSide.value === true && forceServerRequest === true) {
        sendServerRequest(newPagination)
      }
      return
    }

    if (isServerSide.value === true) {
      sendServerRequest(newPagination)
      return
    }

    if (
      props.pagination !== void 0
      && props[ 'onUpdate:pagination' ] !== void 0
    ) {
      emit('update:pagination', newPagination)
    }
    else {
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

export function useTablePagination (vm, innerPagination, computedPagination, isServerSide, setPagination, filteredSortedRowsNumber) {
  const { props, emit, proxy: { $q } } = vm

  const computedRowsNumber = computed(() => (
    isServerSide.value === true
      ? computedPagination.value.rowsNumber || 0
      : filteredSortedRowsNumber.value
  ))

  const firstRowIndex = computed(() => {
    const { page, rowsPerPage } = computedPagination.value
    return (page - 1) * rowsPerPage
  })

  const lastRowIndex = computed(() => {
    const { page, rowsPerPage } = computedPagination.value
    return page * rowsPerPage
  })

  const isFirstPage = computed(() => computedPagination.value.page === 1)

  const pagesNumber = computed(() => (
    computedPagination.value.rowsPerPage === 0
      ? 1
      : Math.max(
        1,
        Math.ceil(computedRowsNumber.value / computedPagination.value.rowsPerPage)
      )
  ))

  const isLastPage = computed(() => (
    lastRowIndex.value === 0
      ? true
      : computedPagination.value.page >= pagesNumber.value
  ))

  const computedRowsPerPageOptions = computed(() => {
    const opts = props.rowsPerPageOptions.includes(innerPagination.value.rowsPerPage)
      ? props.rowsPerPageOptions
      : [ innerPagination.value.rowsPerPage ].concat(props.rowsPerPageOptions)

    return opts.map(count => ({
      label: count === 0 ? $q.lang.table.allRows : '' + count,
      value: count
    }))
  })

  watch(pagesNumber, (lastPage, oldLastPage) => {
    if (lastPage === oldLastPage) {
      return
    }

    const currentPage = computedPagination.value.page
    if (lastPage && !currentPage) {
      setPagination({ page: 1 })
    }
    else if (lastPage < currentPage) {
      setPagination({ page: lastPage })
    }
  })

  function firstPage () {
    setPagination({ page: 1 })
  }

  function prevPage () {
    const { page } = computedPagination.value
    if (page > 1) {
      setPagination({ page: page - 1 })
    }
  }

  function nextPage () {
    const { page, rowsPerPage } = computedPagination.value
    if (lastRowIndex.value > 0 && page * rowsPerPage < computedRowsNumber.value) {
      setPagination({ page: page + 1 })
    }
  }

  function lastPage () {
    setPagination({ page: pagesNumber.value })
  }

  if (props[ 'onUpdate:pagination' ] !== void 0) {
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
