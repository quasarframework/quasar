import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { computed, defineComponent, h, ref } from 'vue'

import {
  useTableColumnSelection,
  useTableColumnSelectionProps
} from './table-column-selection.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

// QTable owns "columns"/"rows"/"tableColspan"; the composable only declares
// "visibleColumns" but reads the others off the same props object
const hostProps = {
  ...useTableColumnSelectionProps,
  columns: Array,
  rows: {
    type: Array,
    default: () => []
  },
  tableColspan: [Number, String]
}

function mountColumnSelection({
  props = {},
  pagination = {},
  selection = false
} = {}) {
  const paginationRef = ref({ sortBy: null, descending: false, ...pagination })
  const hasSelectionMode = ref(selection)
  let api

  wrapper = mount(
    defineComponent({
      props: hostProps,
      setup(componentProps) {
        api = useTableColumnSelection(
          componentProps,
          computed(() => paginationRef.value),
          hasSelectionMode
        )
        return () => h('div')
      }
    }),
    { props }
  )

  return { ...api, paginationRef, hasSelectionMode }
}

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'age', label: 'Age', field: 'age' }
]

function getCol(computedCols, name) {
  return computedCols.value.find(col => col.name === name)
}

describe('[tableColumnSelection API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useTableColumnSelectionProps]', () => {
      test('is defined correctly', () => {
        expect(useTableColumnSelectionProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)useTableColumnSelection]', () => {
      test('returns the column API', () => {
        expect(mountColumnSelection()).toMatchObject({
          colList: expect.$ref(),
          computedCols: expect.$ref(),
          computedColsMap: expect.$ref(),
          computedColspan: expect.$ref()
        })
      })

      test('uses the supplied column definitions as-is', () => {
        const { colList } = mountColumnSelection({ props: { columns } })

        expect(colList.value).toStrictEqual(columns)
      })

      test('infers the columns from the first row', () => {
        const { colList } = mountColumnSelection({
          props: { rows: [{ name: 'John', age: 30 }, { name: 'Jane' }] }
        })

        expect(colList.value).toStrictEqual([
          {
            name: 'name',
            label: 'NAME',
            field: 'name',
            align: 'left',
            sortable: true
          },
          {
            name: 'age',
            label: 'AGE',
            field: 'age',
            align: 'right',
            sortable: true
          }
        ])
      })

      test('infers no column when there is no row', () => {
        const { colList } = mountColumnSelection()

        expect(colList.value).toStrictEqual([])
      })

      test('keeps only the visible columns', () => {
        const { computedCols } = mountColumnSelection({
          props: { columns, visibleColumns: ['age'] }
        })

        expect(computedCols.value.map(col => col.name)).toStrictEqual(['age'])
      })

      test('always keeps a required column', () => {
        const { computedCols } = mountColumnSelection({
          props: {
            columns: [{ ...columns[0], required: true }, columns[1]],
            visibleColumns: ['age']
          }
        })

        expect(computedCols.value.map(col => col.name)).toStrictEqual([
          'name',
          'age'
        ])
      })

      test('defaults the alignment to the right', () => {
        const { computedCols } = mountColumnSelection({ props: { columns } })

        expect(getCol(computedCols, 'name').align).toBe('left')
        expect(getCol(computedCols, 'age').align).toBe('right')
      })

      test('derives the sort icon and header classes from the alignment', () => {
        const { computedCols } = mountColumnSelection({ props: { columns } })
        const col = getCol(computedCols, 'name')

        expect(col.__iconClass).toContain('q-table__sort-icon--left')
        expect(col.__thClass).toContain('text-left')
      })

      test('appends the custom header classes', () => {
        const { computedCols } = mountColumnSelection({
          props: { columns: [{ ...columns[0], headerClasses: 'my-header' }] }
        })

        expect(getCol(computedCols, 'name').__thClass).toContain('my-header')
      })

      test('marks the sortable columns', () => {
        const { computedCols } = mountColumnSelection({ props: { columns } })

        expect(getCol(computedCols, 'name').__thClass).toContain('sortable')
        expect(getCol(computedCols, 'age').__thClass).not.toContain('sortable')
      })

      test('marks the column currently sorted by', () => {
        const { computedCols, paginationRef } = mountColumnSelection({
          props: { columns },
          pagination: { sortBy: 'name', descending: false }
        })

        expect(getCol(computedCols, 'name').__thClass).toContain('sorted')
        expect(getCol(computedCols, 'name').__thClass).not.toContain(
          'sort-desc'
        )
        expect(getCol(computedCols, 'age').__thClass).not.toContain('sorted')

        paginationRef.value = { sortBy: 'name', descending: true }
        expect(getCol(computedCols, 'name').__thClass).toContain('sort-desc')
      })

      test('exposes the sorting state for assistive technologies', () => {
        const { computedCols, paginationRef } = mountColumnSelection({
          props: { columns }
        })

        expect(getCol(computedCols, 'name').__ariaSort).toBe('none')
        // a non-sortable column has no sorting state at all
        expect(getCol(computedCols, 'age').__ariaSort).toBeUndefined()

        paginationRef.value = { sortBy: 'name', descending: false }
        expect(getCol(computedCols, 'name').__ariaSort).toBe('ascending')

        paginationRef.value = { sortBy: 'name', descending: true }
        expect(getCol(computedCols, 'name').__ariaSort).toBe('descending')
      })

      test('turns the cell style into a getter', () => {
        const style = { color: 'red' }
        const styleFn = row => ({ color: row.color })
        const { computedCols } = mountColumnSelection({
          props: {
            columns: [
              { name: 'a', field: 'a' },
              { name: 'b', field: 'b', style },
              { name: 'c', field: 'c', style: styleFn }
            ]
          }
        })

        expect(getCol(computedCols, 'a').__tdStyle({})).toBeNull()
        expect(getCol(computedCols, 'b').__tdStyle({})).toStrictEqual(style)
        expect(
          getCol(computedCols, 'c').__tdStyle({ color: 'blue' })
        ).toStrictEqual({
          color: 'blue'
        })
      })

      test('turns the cell classes into a getter which keeps the alignment', () => {
        const { computedCols } = mountColumnSelection({
          props: {
            columns: [
              { name: 'a', field: 'a', align: 'left' },
              { name: 'b', field: 'b', align: 'left', classes: 'my-cell' },
              {
                name: 'c',
                field: 'c',
                align: 'left',
                classes: row => row.cls
              }
            ]
          }
        })

        expect(getCol(computedCols, 'a').__tdClass({})).toBe('text-left')
        expect(getCol(computedCols, 'b').__tdClass({})).toBe(
          'text-left my-cell'
        )
        expect(getCol(computedCols, 'c').__tdClass({ cls: 'dyn' })).toBe(
          'text-left dyn'
        )
      })

      test('indexes the computed columns by name', () => {
        const { computedCols, computedColsMap } = mountColumnSelection({
          props: { columns }
        })

        expect(Object.keys(computedColsMap.value)).toStrictEqual([
          'name',
          'age'
        ])
        expect(computedColsMap.value.name).toBe(getCol(computedCols, 'name'))
      })

      test('counts the columns for the table colspan', () => {
        const { computedColspan } = mountColumnSelection({ props: { columns } })

        expect(computedColspan.value).toBe(2)
      })

      test('reserves an extra colspan column for the selection', () => {
        const { computedColspan } = mountColumnSelection({
          props: { columns },
          selection: true
        })

        expect(computedColspan.value).toBe(3)
      })

      test('lets the tableColspan prop win', () => {
        const { computedColspan } = mountColumnSelection({
          props: { columns, tableColspan: 7 },
          selection: true
        })

        expect(computedColspan.value).toBe(7)
      })
    })
  })
})
