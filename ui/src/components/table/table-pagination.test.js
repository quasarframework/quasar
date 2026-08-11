import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { defineComponent, getCurrentInstance, h, nextTick, ref } from 'vue'

import {
  useTablePagination,
  useTablePaginationProps,
  useTablePaginationState
} from './table-pagination.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

// QTable owns "filter"; the composable reads it off the same props object
const hostProps = {
  ...useTablePaginationProps,
  filter: [String, Object]
}

const getCellValue = (col, row) => row[col.name]

/**
 * Mounts only the pagination state part (the source of truth).
 */
function mountState({ props = {} } = {}) {
  let api

  wrapper = mount(
    defineComponent({
      props: hostProps,
      emits: ['request', 'update:pagination'],
      setup() {
        api = useTablePaginationState(getCurrentInstance(), getCellValue)
        return () => h('div')
      }
    }),
    { props }
  )

  return api
}

/**
 * Mounts the full pair, the way QTable wires them together.
 */
function mountPagination({ props = {}, rowsNumber = 0 } = {}) {
  const filteredSortedRowsNumber = ref(rowsNumber)
  let state, api

  wrapper = mount(
    defineComponent({
      props: hostProps,
      emits: ['request', 'update:pagination'],
      setup() {
        const vm = getCurrentInstance()
        state = useTablePaginationState(vm, getCellValue)
        api = useTablePagination(
          vm,
          state.innerPagination,
          state.computedPagination,
          state.isServerSide,
          state.setPagination,
          filteredSortedRowsNumber
        )
        return () => h('div')
      }
    }),
    { props }
  )

  return { ...state, ...api, filteredSortedRowsNumber }
}

describe('[tablePagination API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useTablePaginationProps]', () => {
      test('is defined correctly', () => {
        expect(useTablePaginationProps).$props()
      })

      test('offers a default set of rows-per-page options', () => {
        const options = useTablePaginationProps.rowsPerPageOptions.default()

        expect(options).not.toHaveLength(0)
        expect(options).$arrayValues(expect.any(Number))
        // 0 stands for "all rows"
        expect(options).toContain(0)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)useTablePaginationState]', () => {
      test('returns the pagination state', () => {
        expect(mountState()).toMatchObject({
          innerPagination: expect.$ref(),
          computedPagination: expect.$ref(),
          isServerSide: expect.$ref(false),

          requestServerInteraction: expect.any(Function),
          setPagination: expect.any(Function)
        })
      })

      test('starts unsorted on the first page', () => {
        const { computedPagination } = mountState()

        expect(computedPagination.value).toMatchObject({
          sortBy: null,
          descending: false,
          page: 1
        })
      })

      test('takes the first rows-per-page option as the page size', () => {
        const { computedPagination } = mountState({
          props: { rowsPerPageOptions: [7, 14] }
        })

        expect(computedPagination.value.rowsPerPage).toBe(7)
      })

      test('falls back to a page size when there is no option at all', () => {
        const { computedPagination } = mountState({
          props: { rowsPerPageOptions: [] }
        })

        expect(computedPagination.value.rowsPerPage).toBeGreaterThan(0)
      })

      test('seeds the state from the pagination prop', () => {
        const { computedPagination } = mountState({
          props: { pagination: { page: 3, rowsPerPage: 20, sortBy: 'name' } }
        })

        expect(computedPagination.value).toMatchObject({
          page: 3,
          rowsPerPage: 20,
          sortBy: 'name'
        })
      })

      test('clamps an out of range page and page size', () => {
        const { computedPagination } = mountState({
          props: { pagination: { page: 0, rowsPerPage: -5 } }
        })

        expect(computedPagination.value.page).toBe(1)
        expect(computedPagination.value.rowsPerPage).toBe(0)
      })

      test('is server-side as soon as the row count is supplied', () => {
        expect(mountState().isServerSide.value).toBe(false)
        expect(
          mountState({ props: { pagination: { rowsNumber: 100 } } })
            .isServerSide.value
        ).toBe(true)
      })

      test('updates its own state when uncontrolled', () => {
        const { computedPagination, setPagination } = mountState()

        setPagination({ page: 2 })

        expect(computedPagination.value.page).toBe(2)
        expect(wrapper.emitted('update:pagination')).toBeUndefined()
      })

      test('emits instead of self-updating when controlled', () => {
        const { computedPagination, setPagination } = mountState({
          props: {
            pagination: { page: 1, rowsPerPage: 5 },
            'onUpdate:pagination': () => {}
          }
        })

        setPagination({ page: 2 })

        expect(wrapper.emitted('update:pagination')).toStrictEqual([
          [expect.objectContaining({ page: 2 })]
        ])
        // the parent is in charge, so nothing changed locally
        expect(computedPagination.value.page).toBe(1)
      })

      test('lets the pagination prop win while controlled', async () => {
        const { computedPagination } = mountState({
          props: {
            pagination: { page: 4 },
            'onUpdate:pagination': () => {}
          }
        })

        expect(computedPagination.value.page).toBe(4)

        await wrapper.setProps({ pagination: { page: 6 } })
        expect(computedPagination.value.page).toBe(6)
      })

      test('ignores a request which changes nothing', () => {
        const { computedPagination, setPagination } = mountState({
          props: {
            pagination: { page: 1 },
            'onUpdate:pagination': () => {}
          }
        })

        setPagination({ page: computedPagination.value.page })

        expect(wrapper.emitted('update:pagination')).toBeUndefined()
      })

      test('asks the server for the new page instead of paginating locally', async () => {
        const { setPagination } = mountState({
          props: { pagination: { rowsNumber: 100 }, filter: 'term' }
        })

        setPagination({ page: 2 })
        await nextTick()

        expect(wrapper.emitted('request')).toStrictEqual([
          [
            {
              pagination: expect.objectContaining({ page: 2 }),
              filter: 'term',
              getCellValue
            }
          ]
        ])
      })

      test('does not ask the server when nothing changed', async () => {
        const { computedPagination, setPagination } = mountState({
          props: { pagination: { rowsNumber: 100 } }
        })

        setPagination({ page: computedPagination.value.page })
        await nextTick()

        expect(wrapper.emitted('request')).toBeUndefined()
      })

      test('can be forced to ask the server even when nothing changed', async () => {
        const { computedPagination, setPagination } = mountState({
          props: { pagination: { rowsNumber: 100 } }
        })

        setPagination({ page: computedPagination.value.page }, true)
        await nextTick()

        expect(wrapper.emitted('request')).toHaveLength(1)
      })

      test('requests a server interaction with the current state', async () => {
        const { requestServerInteraction } = mountState({
          props: { filter: 'term' }
        })

        requestServerInteraction()
        await nextTick()

        expect(wrapper.emitted('request')[0][0]).toStrictEqual({
          pagination: expect.objectContaining({ page: 1 }),
          filter: 'term',
          getCellValue
        })
      })

      test('requests a server interaction with an overridden state', async () => {
        const { requestServerInteraction } = mountState()
        const pagination = { page: 9 }

        requestServerInteraction({ pagination, filter: 'other' })
        await nextTick()

        expect(wrapper.emitted('request')[0][0]).toStrictEqual({
          pagination,
          filter: 'other',
          getCellValue
        })
      })
    })

    describe('[(function)useTablePagination]', () => {
      test('returns the pagination navigation API', () => {
        expect(mountPagination()).toMatchObject({
          firstRowIndex: expect.$ref(expect.any(Number)),
          lastRowIndex: expect.$ref(expect.any(Number)),
          isFirstPage: expect.$ref(expect.any(Boolean)),
          isLastPage: expect.$ref(expect.any(Boolean)),
          pagesNumber: expect.$ref(expect.any(Number)),
          computedRowsPerPageOptions: expect.$ref(expect.any(Array)),
          computedRowsNumber: expect.$ref(expect.any(Number)),

          firstPage: expect.any(Function),
          prevPage: expect.any(Function),
          nextPage: expect.any(Function),
          lastPage: expect.any(Function)
        })
      })

      test('computes the row range of the current page', async () => {
        const { firstRowIndex, lastRowIndex, setPagination } = mountPagination({
          props: { pagination: { rowsPerPage: 10 } },
          rowsNumber: 50
        })

        expect(firstRowIndex.value).toBe(0)
        expect(lastRowIndex.value).toBe(10)

        setPagination({ page: 3 })
        await nextTick()

        expect(firstRowIndex.value).toBe(20)
        expect(lastRowIndex.value).toBe(30)
      })

      test('counts the pages out of the filtered rows', () => {
        const { pagesNumber, computedRowsNumber } = mountPagination({
          props: { pagination: { rowsPerPage: 10 } },
          rowsNumber: 25
        })

        expect(computedRowsNumber.value).toBe(25)
        expect(pagesNumber.value).toBe(3)
      })

      test('counts a single page when showing all rows', () => {
        const { pagesNumber } = mountPagination({
          props: { pagination: { rowsPerPage: 0 } },
          rowsNumber: 25
        })

        expect(pagesNumber.value).toBe(1)
      })

      test('always counts at least one page', () => {
        const { pagesNumber } = mountPagination({
          props: { pagination: { rowsPerPage: 10 } },
          rowsNumber: 0
        })

        expect(pagesNumber.value).toBe(1)
      })

      test('takes the row count from the server when server-side', () => {
        const { computedRowsNumber, pagesNumber } = mountPagination({
          props: { pagination: { rowsPerPage: 10, rowsNumber: 95 } },
          rowsNumber: 3
        })

        expect(computedRowsNumber.value).toBe(95)
        expect(pagesNumber.value).toBe(10)
      })

      test('flags the first and the last page', async () => {
        const { isFirstPage, isLastPage, setPagination } = mountPagination({
          props: { pagination: { rowsPerPage: 10 } },
          rowsNumber: 25
        })

        expect(isFirstPage.value).toBe(true)
        expect(isLastPage.value).toBe(false)

        setPagination({ page: 3 })
        await nextTick()

        expect(isFirstPage.value).toBe(false)
        expect(isLastPage.value).toBe(true)
      })

      test('flags a single "all rows" page as both first and last', () => {
        const { isFirstPage, isLastPage } = mountPagination({
          props: { pagination: { rowsPerPage: 0 } },
          rowsNumber: 25
        })

        expect(isFirstPage.value).toBe(true)
        expect(isLastPage.value).toBe(true)
      })

      test('navigates between the pages', async () => {
        const { computedPagination, firstPage, prevPage, nextPage, lastPage } =
          mountPagination({
            props: { pagination: { rowsPerPage: 10 } },
            rowsNumber: 25
          })

        nextPage()
        await nextTick()
        expect(computedPagination.value.page).toBe(2)

        prevPage()
        await nextTick()
        expect(computedPagination.value.page).toBe(1)

        lastPage()
        await nextTick()
        expect(computedPagination.value.page).toBe(3)

        firstPage()
        await nextTick()
        expect(computedPagination.value.page).toBe(1)
      })

      test('does not go before the first page', async () => {
        const { computedPagination, prevPage } = mountPagination({
          props: { pagination: { rowsPerPage: 10 } },
          rowsNumber: 25
        })

        prevPage()
        await nextTick()

        expect(computedPagination.value.page).toBe(1)
      })

      test('does not go past the last page', async () => {
        const { computedPagination, nextPage, setPagination } = mountPagination(
          {
            props: { pagination: { rowsPerPage: 10 } },
            rowsNumber: 25
          }
        )

        setPagination({ page: 3 })
        await nextTick()

        nextPage()
        await nextTick()

        expect(computedPagination.value.page).toBe(3)
      })

      test('clamps the current page when the rows shrink', async () => {
        const { computedPagination, setPagination, filteredSortedRowsNumber } =
          mountPagination({
            props: { pagination: { rowsPerPage: 10 } },
            rowsNumber: 50
          })

        setPagination({ page: 5 })
        await nextTick()
        expect(computedPagination.value.page).toBe(5)

        filteredSortedRowsNumber.value = 12
        await nextTick()
        await nextTick()

        expect(computedPagination.value.page).toBe(2)
      })

      test('labels the rows-per-page options', () => {
        const { computedRowsPerPageOptions } = mountPagination({
          props: { rowsPerPageOptions: [5, 0] }
        })

        expect(computedRowsPerPageOptions.value).toStrictEqual([
          { label: '5', value: 5 },
          { label: expect.any(String), value: 0 }
        ])
        // 0 gets the localized "all rows" label
        expect(computedRowsPerPageOptions.value[1].label).not.toBe('0')
      })

      test('adds the current page size when it is not among the options', () => {
        const { computedRowsPerPageOptions } = mountPagination({
          props: {
            rowsPerPageOptions: [5, 10],
            pagination: { rowsPerPage: 7 }
          }
        })

        expect(
          computedRowsPerPageOptions.value.map(opt => opt.value)
        ).toStrictEqual([7, 5, 10])
      })

      test('announces the initial pagination to a controlling parent', () => {
        mountPagination({
          props: {
            pagination: { page: 2, rowsPerPage: 10 },
            'onUpdate:pagination': () => {}
          }
        })

        expect(wrapper.emitted('update:pagination')).toStrictEqual([
          [expect.objectContaining({ page: 2, rowsPerPage: 10 })]
        ])
      })

      test('stays quiet when it is not controlled', () => {
        mountPagination({ props: { pagination: { page: 2 } } })

        expect(wrapper.emitted('update:pagination')).toBeUndefined()
      })
    })
  })
})
