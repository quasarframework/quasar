import { afterEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import {
  useTableRowExpand,
  useTableRowExpandEmits,
  useTableRowExpandProps
} from './table-row-expand.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

function mountRowExpand(props = {}) {
  let api

  wrapper = mount(
    defineComponent({
      props: useTableRowExpandProps,
      emits: useTableRowExpandEmits,
      setup(componentProps, { emit }) {
        api = useTableRowExpand(componentProps, emit)
        return () => h('div')
      }
    }),
    { props }
  )

  return api
}

function getEmitted() {
  return wrapper.emitted('update:expanded')
}

describe('[tableRowExpand API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useTableRowExpandProps]', () => {
      test('is defined correctly', () => {
        expect(useTableRowExpandProps).$props()
      })
    })

    describe('[(variable)useTableRowExpandEmits]', () => {
      test('is defined correctly', () => {
        expect(useTableRowExpandEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)useTableRowExpand]', () => {
      test('returns the expansion API', () => {
        expect(mountRowExpand()).toStrictEqual({
          isRowExpanded: expect.any(Function),
          setExpanded: expect.any(Function),
          updateExpanded: expect.any(Function)
        })
      })

      test('starts with nothing expanded when uncontrolled', () => {
        const { isRowExpanded } = mountRowExpand()

        expect(isRowExpanded('a')).toBe(false)
      })

      test('picks up the initial value of the expanded prop', () => {
        const { isRowExpanded } = mountRowExpand({ expanded: ['a'] })

        expect(isRowExpanded('a')).toBe(true)
        expect(isRowExpanded('b')).toBe(false)
      })

      test('expands and collapses rows when uncontrolled', () => {
        const { isRowExpanded, updateExpanded } = mountRowExpand()

        updateExpanded('a', true)
        expect(isRowExpanded('a')).toBe(true)

        updateExpanded('b', true)
        expect(isRowExpanded('a')).toBe(true)
        expect(isRowExpanded('b')).toBe(true)

        updateExpanded('a', false)
        expect(isRowExpanded('a')).toBe(false)
        expect(isRowExpanded('b')).toBe(true)

        expect(getEmitted()).toBeUndefined()
      })

      test('ignores redundant expand/collapse requests', () => {
        const { isRowExpanded, updateExpanded } = mountRowExpand()

        updateExpanded('a', true)
        updateExpanded('a', true)
        updateExpanded('b', false)

        expect(isRowExpanded('a')).toBe(true)
        expect(isRowExpanded('b')).toBe(false)
      })

      test('replaces the whole list through setExpanded when uncontrolled', () => {
        const { isRowExpanded, setExpanded } = mountRowExpand()

        setExpanded(['a', 'b'])
        expect(isRowExpanded('a')).toBe(true)
        expect(isRowExpanded('b')).toBe(true)

        setExpanded([])
        expect(isRowExpanded('a')).toBe(false)

        expect(getEmitted()).toBeUndefined()
      })

      test('emits instead of self-updating when controlled', () => {
        const { isRowExpanded, updateExpanded } = mountRowExpand({
          expanded: ['a']
        })

        updateExpanded('b', true)

        expect(getEmitted()).toStrictEqual([[['a', 'b']]])
        // the parent is in charge, so nothing changed locally
        expect(isRowExpanded('b')).toBe(false)
      })

      test('emits the list without the collapsed row when controlled', () => {
        const { setExpanded, updateExpanded } = mountRowExpand({
          expanded: ['a', 'b']
        })

        updateExpanded('a', false)
        expect(getEmitted()).toStrictEqual([[['b']]])

        setExpanded(['c'])
        expect(getEmitted()).toStrictEqual([[['b']], [['c']]])
      })

      test('follows the expanded prop being changed', async () => {
        const { isRowExpanded } = mountRowExpand({ expanded: ['a'] })

        await wrapper.setProps({ expanded: ['b'] })

        expect(isRowExpanded('a')).toBe(false)
        expect(isRowExpanded('b')).toBe(true)
      })

      test.each([[void 0], [null]])(
        'treats a non-array expanded prop (%s) as empty',
        async expanded => {
          const { isRowExpanded } = mountRowExpand({ expanded: ['a'] })

          await wrapper.setProps({ expanded })

          expect(isRowExpanded('a')).toBe(false)
        }
      )

      test('never mutates the expanded prop array', () => {
        const expanded = ['a']
        const { updateExpanded } = mountRowExpand({ expanded })

        updateExpanded('b', true)

        expect(expanded).toStrictEqual(['a'])
        expect(getEmitted()[0][0]).not.toBe(expanded)
      })
    })
  })
})
