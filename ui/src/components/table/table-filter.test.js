import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive } from 'vue'

import { useTableFilter, useTableFilterProps } from './table-filter.js'

const cols = [{ name: 'name' }, { name: 'city' }]
const rows = [
  { name: 'John', city: 'Paris' },
  { name: 'Jane', city: 'London' },
  { name: 'Bob', city: null }
]

// mimics QTable's internal cell value getter
const cellValue = (col, row) => row[col.name]

function mountFilter(props = {}) {
  const setPagination = vi.fn()
  let computedFilterMethod

  const wrapper = mount(
    defineComponent({
      props: useTableFilterProps,
      setup(componentProps) {
        ;({ computedFilterMethod } = useTableFilter(
          componentProps,
          setPagination
        ))
        return () => h('div')
      }
    }),
    { props }
  )

  return {
    wrapper,
    setPagination,
    filter: (terms, list = rows) =>
      computedFilterMethod.value(list, terms, cols, cellValue),
    getMethod: () => computedFilterMethod.value
  }
}

describe('[tableFilter API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useTableFilterProps]', () => {
      test('is defined correctly', () => {
        expect(useTableFilterProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)useTableFilter]', () => {
      test('returns the filter method', () => {
        const { wrapper, getMethod } = mountFilter()

        expect(getMethod()).toBeTypeOf('function')

        wrapper.unmount()
      })

      test('keeps only the rows matching the terms in any column', () => {
        const { wrapper, filter } = mountFilter()

        expect(filter('paris')).toStrictEqual([rows[0]])
        expect(filter('j')).toStrictEqual([rows[0], rows[1]])

        wrapper.unmount()
      })

      test('matches case-insensitively and on partial values', () => {
        const { wrapper, filter } = mountFilter()

        expect(filter('LonDo')).toStrictEqual([rows[1]])

        wrapper.unmount()
      })

      test('keeps all rows for empty terms', () => {
        const { wrapper, filter } = mountFilter()

        expect(filter('')).toStrictEqual(rows)
        expect(filter(void 0)).toStrictEqual(rows)
        expect(filter(null)).toStrictEqual(rows)

        wrapper.unmount()
      })

      test('never matches null or undefined cell values', () => {
        const { wrapper, filter } = mountFilter()

        // rows[ 2 ].city is null; it must not be searched as "null"
        expect(filter('null')).toStrictEqual([])
        expect(filter('undefined')).toStrictEqual([])

        wrapper.unmount()
      })

      test('uses the supplied filterMethod instead of the default one', () => {
        const filterMethod = vi.fn(() => ['custom'])
        const { wrapper, filter, getMethod } = mountFilter({ filterMethod })

        expect(getMethod()).toBe(filterMethod)
        expect(filter('paris')).toStrictEqual(['custom'])
        expect(filterMethod).toHaveBeenCalledWith(
          rows,
          'paris',
          cols,
          cellValue
        )

        wrapper.unmount()
      })

      test('reacts to the filterMethod prop being changed', async () => {
        const filterMethod = vi.fn(() => [])
        const { wrapper, getMethod } = mountFilter()

        expect(getMethod()).not.toBe(filterMethod)

        await wrapper.setProps({ filterMethod })
        expect(getMethod()).toBe(filterMethod)

        await wrapper.setProps({ filterMethod: void 0 })
        expect(getMethod()).not.toBe(filterMethod)

        wrapper.unmount()
      })

      test('resets to the first page when the filter changes', async () => {
        const { wrapper, setPagination } = mountFilter({ filter: 'a' })

        expect(setPagination).not.toHaveBeenCalled()

        await wrapper.setProps({ filter: 'b' })
        await nextTick()

        expect(setPagination).toHaveBeenCalledTimes(1)
        expect(setPagination).toHaveBeenCalledWith({ page: 1 }, true)

        wrapper.unmount()
      })

      test('watches an object filter deeply', async () => {
        const filter = reactive({ term: 'a' })
        const { wrapper, setPagination } = mountFilter({ filter })

        // the object identity does not change, only one of its keys
        filter.term = 'b'
        await nextTick()
        await nextTick()

        expect(setPagination).toHaveBeenCalledTimes(1)
        expect(setPagination).toHaveBeenCalledWith({ page: 1 }, true)

        wrapper.unmount()
      })
    })
  })
})
