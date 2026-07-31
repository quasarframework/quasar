import { afterEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, ref, shallowRef } from 'vue'

import { useTableSort, useTableSortProps } from './table-sort.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

const defaultColumns = [
  { name: 'name', field: 'name' },
  { name: 'age', field: 'age' },
  { name: 'noField' }
]

function mountSort({
  props = {},
  columns = defaultColumns,
  pagination = {}
} = {}) {
  wrapper?.unmount()

  const setPagination = vi.fn()
  const colList = shallowRef(columns)
  const paginationRef = ref({ sortBy: null, descending: false, ...pagination })
  const computedPagination = computed(() => paginationRef.value)
  let api

  wrapper = mount(
    defineComponent({
      props: useTableSortProps,
      setup(componentProps) {
        api = useTableSort(
          componentProps,
          computedPagination,
          colList,
          setPagination
        )
        return () => h('div')
      }
    }),
    { props }
  )

  return { ...api, setPagination, colList, paginationRef }
}

function sortRows({ rows, sortBy = 'name', descending = false, columns }) {
  const { computedSortMethod } = mountSort({ columns })
  return computedSortMethod.value(rows, sortBy, descending)
}

describe('[tableSort API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useTableSortProps]', () => {
      test('is defined correctly', () => {
        expect(useTableSortProps).$props()
      })

      test('only accepts the two documented column sort orders', () => {
        const { validator, default: defaultValue } =
          useTableSortProps.columnSortOrder

        expect(validator('ad')).toBe(true)
        expect(validator('da')).toBe(true)
        expect(validator('')).toBe(false)
        expect(validator('asc')).toBe(false)
        expect(validator(defaultValue)).toBe(true)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)useTableSort]', () => {
      test('returns the sorting API', () => {
        const { columnToSort, computedSortMethod, sort } = mountSort()

        expect(columnToSort).$ref()
        expect(computedSortMethod).$ref(expect.any(Function))
        expect(sort).toBeTypeOf('function')
      })

      test('resolves the column currently sorted by', () => {
        const { columnToSort, paginationRef } = mountSort()

        expect(columnToSort.value).toBeNull()

        paginationRef.value = { sortBy: 'age', descending: false }
        expect(columnToSort.value).toBe(defaultColumns[1])

        paginationRef.value = { sortBy: 'unknown', descending: false }
        expect(columnToSort.value).toBeNull()
      })

      test('uses the supplied sortMethod instead of the default one', () => {
        const sortMethod = vi.fn(() => ['custom'])
        const { computedSortMethod } = mountSort({ props: { sortMethod } })

        expect(computedSortMethod.value).toBe(sortMethod)
        expect(computedSortMethod.value([], 'name', true)).toStrictEqual([
          'custom'
        ])
      })

      test('leaves the data untouched for an unknown or field-less column', () => {
        const rows = [{ name: 'b' }, { name: 'a' }]

        expect(sortRows({ rows, sortBy: 'unknown' })).toStrictEqual(rows)
        expect(sortRows({ rows, sortBy: 'noField' })).toStrictEqual(rows)
      })

      test('sorts numbers numerically', () => {
        const rows = [{ age: 10 }, { age: 2 }, { age: 33 }]

        expect(sortRows({ rows, sortBy: 'age' })).toStrictEqual([
          { age: 2 },
          { age: 10 },
          { age: 33 }
        ])
      })

      test('sorts strings case-insensitively', () => {
        const rows = [{ name: 'b' }, { name: 'A' }, { name: 'c' }]

        expect(sortRows({ rows })).toStrictEqual([
          { name: 'A' },
          { name: 'b' },
          { name: 'c' }
        ])
      })

      test('sorts dates chronologically', () => {
        const rows = [
          { name: new Date(300) },
          { name: new Date(100) },
          { name: new Date(200) }
        ]

        expect(sortRows({ rows })).toStrictEqual([
          { name: new Date(100) },
          { name: new Date(200) },
          { name: new Date(300) }
        ])
      })

      test('sorts booleans with false first', () => {
        const rows = [{ name: true }, { name: false }, { name: true }]

        expect(sortRows({ rows })).toStrictEqual([
          { name: false },
          { name: true },
          { name: true }
        ])
      })

      test('reverses the order when descending', () => {
        const rows = [{ age: 10 }, { age: 2 }, { age: 33 }]

        expect(
          sortRows({ rows, sortBy: 'age', descending: true })
        ).toStrictEqual([{ age: 33 }, { age: 10 }, { age: 2 }])
      })

      test('keeps null and undefined values at the top when ascending', () => {
        const rows = [{ age: 10 }, { age: null }, { age: 2 }, {}]
        const result = sortRows({ rows, sortBy: 'age' })

        expect(
          result
            .slice(0, 2)
            .map(row => row.age)
            .sort()
        ).toStrictEqual([null, void 0].sort())
        expect(result.slice(2)).toStrictEqual([{ age: 2 }, { age: 10 }])
      })

      test('keeps null and undefined values at the bottom when descending', () => {
        const rows = [{ age: 10 }, { age: null }, { age: 2 }, {}]
        const result = sortRows({ rows, sortBy: 'age', descending: true })

        expect(result.slice(0, 2)).toStrictEqual([{ age: 10 }, { age: 2 }])
        expect(
          result
            .slice(2)
            .map(row => row.age)
            .sort()
        ).toStrictEqual([null, void 0].sort())
      })

      test('supports a function as the column field', () => {
        const columns = [{ name: 'name', field: row => row.nested.value }]
        const rows = [{ nested: { value: 2 } }, { nested: { value: 1 } }]

        expect(sortRows({ rows, columns })).toStrictEqual([
          { nested: { value: 1 } },
          { nested: { value: 2 } }
        ])
      })

      test('uses the column "sort" function when supplied', () => {
        const sort = vi.fn((a, b) => a.length - b.length)
        const columns = [{ name: 'name', field: 'name', sort }]
        const rows = [{ name: 'aaa' }, { name: 'a' }, { name: 'aa' }]

        expect(sortRows({ rows, columns })).toStrictEqual([
          { name: 'a' },
          { name: 'aa' },
          { name: 'aaa' }
        ])
        expect(sort.mock.calls[0]).toHaveLength(4)
      })

      test('does not call the column "sort" function for empty values', () => {
        const sort = vi.fn(() => 0)
        const columns = [{ name: 'name', field: 'name', sort }]
        const rows = [{ name: 'a' }, { name: null }, {}, { name: 'b' }]

        sortRows({ rows, columns })

        expect(sort).toHaveBeenCalled()
        sort.mock.calls.forEach(([a, b]) => {
          expect(a).not.toBeNull()
          expect(b).not.toBeNull()
          expect(a).toBeDefined()
          expect(b).toBeDefined()
        })
      })

      test('uses the column "rawSort" function even for empty values', () => {
        const rawSort = vi.fn(() => 0)
        const columns = [{ name: 'name', field: 'name', rawSort }]
        const rows = [{ name: 'a' }, { name: null }, {}]

        sortRows({ rows, columns })

        expect(rawSort).toHaveBeenCalled()
        expect(
          rawSort.mock.calls.some(([a, b]) => a === null || b === null)
        ).toBe(true)
      })

      test('sorts a new column ascending by default', () => {
        const { sort, setPagination } = mountSort()

        sort('name')

        expect(setPagination).toHaveBeenCalledWith({
          sortBy: 'name',
          descending: false,
          page: 1
        })
      })

      test('sorts a new column descending when the sort order is "da"', () => {
        const { sort, setPagination } = mountSort({
          props: { columnSortOrder: 'da' }
        })

        sort('name')

        expect(setPagination).toHaveBeenCalledWith({
          sortBy: 'name',
          descending: true,
          page: 1
        })
      })

      test('cycles ascending -> descending -> none for the same column', () => {
        const { sort, setPagination, paginationRef } = mountSort({
          pagination: { sortBy: 'name', descending: false }
        })

        sort('name')
        expect(setPagination).toHaveBeenLastCalledWith({
          sortBy: 'name',
          descending: true,
          page: 1
        })

        paginationRef.value = { sortBy: 'name', descending: true }
        sort('name')
        expect(setPagination).toHaveBeenLastCalledWith({
          sortBy: null,
          descending: true,
          page: 1
        })
      })

      test('cycles descending -> ascending -> none when the sort order is "da"', () => {
        const { sort, setPagination, paginationRef } = mountSort({
          props: { columnSortOrder: 'da' },
          pagination: { sortBy: 'name', descending: true }
        })

        sort('name')
        expect(setPagination).toHaveBeenLastCalledWith({
          sortBy: 'name',
          descending: false,
          page: 1
        })

        paginationRef.value = { sortBy: 'name', descending: false }
        sort('name')
        expect(setPagination).toHaveBeenLastCalledWith({
          sortBy: null,
          descending: false,
          page: 1
        })
      })

      test('only toggles the direction when binaryStateSort is set', () => {
        const { sort, setPagination, paginationRef } = mountSort({
          props: { binaryStateSort: true },
          pagination: { sortBy: 'name', descending: true }
        })

        sort('name')
        expect(setPagination).toHaveBeenLastCalledWith({
          sortBy: 'name',
          descending: false,
          page: 1
        })

        paginationRef.value = { sortBy: 'name', descending: false }
        sort('name')
        expect(setPagination).toHaveBeenLastCalledWith({
          sortBy: 'name',
          descending: true,
          page: 1
        })
      })

      test('accepts a column definition instead of a column name', () => {
        const { sort, setPagination } = mountSort()

        sort(defaultColumns[1])

        expect(setPagination).toHaveBeenCalledWith({
          sortBy: 'age',
          descending: false,
          page: 1
        })
      })

      test('lets the column definition override the sort order', () => {
        const columns = [{ name: 'name', field: 'name', sortOrder: 'da' }]
        const { sort, setPagination } = mountSort({ columns })

        sort('name')
        expect(setPagination).toHaveBeenLastCalledWith({
          sortBy: 'name',
          descending: true,
          page: 1
        })

        // ...also when the definition itself is supplied
        sort({ name: 'other', sortOrder: 'da' })
        expect(setPagination).toHaveBeenLastCalledWith({
          sortBy: 'other',
          descending: true,
          page: 1
        })
      })

      test('always resets to the first page', () => {
        const { sort, setPagination } = mountSort()

        sort('name')
        sort('age')

        setPagination.mock.calls.forEach(([entry]) => {
          expect(entry.page).toBe(1)
        })
      })
    })
  })
})
