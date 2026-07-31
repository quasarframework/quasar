import { afterEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, shallowRef } from 'vue'

import {
  useTableRowSelection,
  useTableRowSelectionEmits,
  useTableRowSelectionProps
} from './table-row-selection.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

const defaultRows = [{ id: 1 }, { id: 2 }, { id: 3 }]

function mountRowSelection({
  props = {},
  rows = defaultRows,
  getRowKey = row => row.id
} = {}) {
  const rowsRef = shallowRef(rows)
  let api

  wrapper = mount(
    defineComponent({
      props: useTableRowSelectionProps,
      emits: useTableRowSelectionEmits,
      setup(componentProps, { emit }) {
        api = useTableRowSelection(
          componentProps,
          emit,
          computed(() => rowsRef.value),
          computed(() => getRowKey)
        )
        return () => h('div')
      }
    }),
    { props }
  )

  return { ...api, rowsRef }
}

describe('[tableRowSelection API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useTableRowSelectionProps]', () => {
      test('is defined correctly', () => {
        expect(useTableRowSelectionProps).$props()
      })

      test('only accepts the three documented selection modes', () => {
        const { validator, default: defaultValue } =
          useTableRowSelectionProps.selection

        expect(validator('single')).toBe(true)
        expect(validator('multiple')).toBe(true)
        expect(validator('none')).toBe(true)
        expect(validator('all')).toBe(false)
        expect(validator(defaultValue)).toBe(true)
      })

      test('defaults to no selection at all', () => {
        const { hasSelectionMode, rowsSelectedNumber } = mountRowSelection()

        expect(hasSelectionMode.value).toBe(false)
        expect(rowsSelectedNumber.value).toBe(0)
      })
    })

    describe('[(variable)useTableRowSelectionEmits]', () => {
      test('is defined correctly', () => {
        expect(useTableRowSelectionEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)useTableRowSelection]', () => {
      test('returns the selection API', () => {
        expect(mountRowSelection()).toMatchObject({
          hasSelectionMode: expect.$ref(),
          singleSelection: expect.$ref(),
          multipleSelection: expect.$ref(),
          allRowsSelected: expect.$ref(),
          someRowsSelected: expect.$ref(),
          rowsSelectedNumber: expect.$ref(),

          isRowSelected: expect.any(Function),
          clearSelection: expect.any(Function),
          updateSelection: expect.any(Function)
        })
      })

      test.each([
        ['none', { has: false, single: false, multiple: false }],
        ['single', { has: true, single: true, multiple: false }],
        ['multiple', { has: true, single: false, multiple: true }]
      ])('reports the "%s" selection mode', (selection, expected) => {
        const { hasSelectionMode, singleSelection, multipleSelection } =
          mountRowSelection({ props: { selection } })

        expect(hasSelectionMode.value).toBe(expected.has)
        expect(singleSelection.value).toBe(expected.single)
        expect(multipleSelection.value).toBe(expected.multiple)
      })

      test('tells apart selected rows by their key', () => {
        const { isRowSelected } = mountRowSelection({
          props: { selection: 'multiple', selected: [{ id: 2 }] }
        })

        expect(isRowSelected(2)).toBe(true)
        expect(isRowSelected(1)).toBe(false)
      })

      test('counts the selected rows', async () => {
        const { rowsSelectedNumber } = mountRowSelection({
          props: { selection: 'multiple', selected: [{ id: 1 }, { id: 2 }] }
        })

        expect(rowsSelectedNumber.value).toBe(2)

        await wrapper.setProps({ selected: [] })
        expect(rowsSelectedNumber.value).toBe(0)
      })

      test('detects that all the displayed rows are selected', () => {
        const { allRowsSelected, someRowsSelected } = mountRowSelection({
          props: { selection: 'multiple', selected: [...defaultRows] }
        })

        expect(allRowsSelected.value).toBe(true)
        expect(someRowsSelected.value).toBe(false)
      })

      test('detects that only some of the displayed rows are selected', () => {
        const { allRowsSelected, someRowsSelected } = mountRowSelection({
          props: { selection: 'multiple', selected: [{ id: 2 }] }
        })

        expect(allRowsSelected.value).toBe(false)
        expect(someRowsSelected.value).toBe(true)
      })

      test('reports nothing as selected when no row is displayed', () => {
        const { allRowsSelected, someRowsSelected } = mountRowSelection({
          props: { selection: 'multiple', selected: [{ id: 1 }] },
          rows: []
        })

        expect(allRowsSelected.value).toBe(false)
        expect(someRowsSelected.value).toBe(false)
      })

      test('ignores selected rows which are not displayed', () => {
        const { allRowsSelected, someRowsSelected, rowsRef } =
          mountRowSelection({
            props: { selection: 'multiple', selected: [{ id: 4 }] }
          })

        expect(allRowsSelected.value).toBe(false)
        expect(someRowsSelected.value).toBe(false)

        rowsRef.value = [{ id: 4 }]
        expect(allRowsSelected.value).toBe(true)
      })

      test('clears the selection', () => {
        const { clearSelection } = mountRowSelection({
          props: { selection: 'multiple', selected: [...defaultRows] }
        })

        clearSelection()

        expect(wrapper.emitted('update:selected')).toStrictEqual([[[]]])
      })

      test('announces every selection change', () => {
        const evt = { type: 'click' }
        const { updateSelection } = mountRowSelection({
          props: { selection: 'multiple' }
        })

        updateSelection([1], [defaultRows[0]], true, evt)

        expect(wrapper.emitted('selection')).toStrictEqual([
          [{ keys: [1], rows: [defaultRows[0]], added: true, evt }]
        ])
      })

      test('adds to the previous selection when multiple', () => {
        const { updateSelection } = mountRowSelection({
          props: { selection: 'multiple', selected: [defaultRows[0]] }
        })

        updateSelection([2], [defaultRows[1]], true)

        expect(wrapper.emitted('update:selected')).toStrictEqual([
          [[defaultRows[0], defaultRows[1]]]
        ])
      })

      test('removes only the given keys from the selection when multiple', () => {
        const { updateSelection } = mountRowSelection({
          props: { selection: 'multiple', selected: [...defaultRows] }
        })

        updateSelection([1, 3], [defaultRows[0], defaultRows[2]], false)

        expect(wrapper.emitted('update:selected')).toStrictEqual([
          [[defaultRows[1]]]
        ])
      })

      test('replaces the previous selection when single', () => {
        const { updateSelection } = mountRowSelection({
          props: { selection: 'single', selected: [defaultRows[0]] }
        })

        updateSelection([2], [defaultRows[1]], true)

        expect(wrapper.emitted('update:selected')).toStrictEqual([
          [[defaultRows[1]]]
        ])
      })

      test('empties the selection when single and deselecting', () => {
        const { updateSelection } = mountRowSelection({
          props: { selection: 'single', selected: [defaultRows[0]] }
        })

        updateSelection([1], [defaultRows[0]], false)

        expect(wrapper.emitted('update:selected')).toStrictEqual([[[]]])
      })

      test('never mutates the selected prop', () => {
        const selected = [defaultRows[0]]
        const { updateSelection } = mountRowSelection({
          props: { selection: 'multiple', selected }
        })

        updateSelection([2], [defaultRows[1]], true)
        updateSelection([1], [defaultRows[0]], false)

        expect(selected).toStrictEqual([defaultRows[0]])
      })

      test('resolves the row keys through the supplied getter', () => {
        const getRowKey = vi.fn(row => row.customId)
        const rows = [{ customId: 'a' }, { customId: 'b' }]
        const { isRowSelected, allRowsSelected } = mountRowSelection({
          props: { selection: 'multiple', selected: [rows[0]] },
          rows,
          getRowKey
        })

        expect(isRowSelected('a')).toBe(true)
        expect(isRowSelected('b')).toBe(false)
        expect(allRowsSelected.value).toBe(false)
        expect(getRowKey).toHaveBeenCalled()
      })
    })
  })
})
