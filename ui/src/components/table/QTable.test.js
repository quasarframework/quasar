import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { getRouter } from 'testing/runtime/router.js'

import QTable from './QTable.js'
import QVirtualScroll from '../virtual-scroll/QVirtualScroll.js'

const defaultColumns = [
  {
    name: 'name',
    label: 'Dessert',
    field: 'name',
    align: 'left',
    sortable: true
  },
  { name: 'calories', label: 'Calories', field: 'calories', sortable: true }
]

// 7 rows so that the default rowsPerPage (5) yields two pages;
// insertion order intentionally differs from the alphabetical one
function getRows() {
  return [
    { id: 1, name: 'Frozen Yogurt', calories: 159 },
    { id: 2, name: 'Ice cream sandwich', calories: 237 },
    { id: 3, name: 'Eclair', calories: 262 },
    { id: 4, name: 'Cupcake', calories: 305 },
    { id: 5, name: 'Gingerbread', calories: 356 },
    { id: 6, name: 'Jelly bean', calories: 375 },
    { id: 7, name: 'Lollipop', calories: 392 }
  ]
}

function getBigRows(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `row-${i + 1}`,
    calories: i * 10
  }))
}

function mountTable(props = {}, options = {}) {
  return mount(QTable, {
    props: { rows: getRows(), columns: defaultColumns, ...props },
    ...options
  })
}

// texts of one column of the rendered body cells
function getColumnTexts(wrapper, colIndex = 0) {
  return wrapper
    .findAll('tbody tr')
    .map(row => row.findAll('td')[colIndex].text())
}

function getFirstThAriaSort(wrapper) {
  return wrapper.findAll('thead th')[0].attributes('aria-sort')
}

const marginalScopeShape = {
  pagination: {
    sortBy: expect.$any([expect.any(String), null]),
    descending: expect.any(Boolean),
    page: expect.any(Number),
    rowsPerPage: expect.any(Number)
  },
  pagesNumber: expect.any(Number),
  isFirstPage: expect.any(Boolean),
  isLastPage: expect.any(Boolean),
  firstPage: expect.any(Function),
  prevPage: expect.any(Function),
  nextPage: expect.any(Function),
  lastPage: expect.any(Function),
  inFullscreen: expect.any(Boolean),
  toggleFullscreen: expect.any(Function)
}

const bodyCommonScopeShape = {
  key: expect.anything(),
  row: expect.any(Object),
  rowIndex: expect.any(Number),
  pageIndex: expect.any(Number),
  cols: expect.any(Array),
  colsMap: expect.any(Object),
  sort: expect.any(Function),
  selected: expect.any(Boolean),
  expand: expect.any(Boolean),
  color: expect.any(String),
  dark: expect.$any([expect.any(Boolean), null]),
  dense: expect.any(Boolean)
}

const headerCommonScopeShape = {
  cols: expect.any(Array),
  colsMap: expect.any(Object),
  sort: expect.any(Function),
  selected: expect.$any([expect.any(Boolean), null]),
  color: expect.any(String),
  dark: expect.$any([expect.any(Boolean), null]),
  dense: expect.any(Boolean)
}

describe('[QTable API]', () => {
  describe('[Props]', () => {
    describe('[(prop)fullscreen]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).not.toContain('fullscreen')

        await wrapper.setProps({ fullscreen: true })
        await flushPromises()

        expect(target.classes()).toContain('fullscreen')

        await wrapper.setProps({ fullscreen: false })
        await flushPromises()

        expect(target.classes()).not.toContain('fullscreen')

        wrapper.unmount()
      })
    })

    describe('[(prop)no-route-fullscreen-exit]', () => {
      test('type Boolean has effect', async () => {
        // without the prop a route change exits fullscreen
        const exitRouter = await getRouter(['/elsewhere'])
        const exiting = mountTable(
          { fullscreen: true },
          { global: { plugins: [exitRouter] } }
        )
        await flushPromises()

        expect(exiting.get('.q-table__container').classes()).toContain(
          'fullscreen'
        )

        await exitRouter.push('/elsewhere')
        await flushPromises()

        expect(exiting.get('.q-table__container').classes()).not.toContain(
          'fullscreen'
        )
        exiting.unmount()

        // with the prop the fullscreen state survives the route change
        const keepRouter = await getRouter(['/elsewhere'])
        const keeping = mountTable(
          { fullscreen: true, noRouteFullscreenExit: true },
          { global: { plugins: [keepRouter] } }
        )
        await flushPromises()

        await keepRouter.push('/elsewhere')
        await flushPromises()

        expect(keeping.get('.q-table__container').classes()).toContain(
          'fullscreen'
        )
        keeping.unmount()
      })
    })

    describe('[(prop)rows]', () => {
      test('type Array has effect', async () => {
        const rows = getRows()
        const wrapper = mountTable({ rows })

        // only the first page gets rendered (default rowsPerPage is 5)
        expect(getColumnTexts(wrapper)).toEqual(
          rows.slice(0, 5).map(row => row.name)
        )

        await wrapper.setProps({ rows: rows.slice(0, 2) })

        expect(getColumnTexts(wrapper)).toEqual([rows[0].name, rows[1].name])
      })
    })

    describe('[(prop)row-key]', () => {
      test('type String has effect', () => {
        const rows = getRows()
        const wrapper = mountTable({
          rowKey: 'name',
          selection: 'multiple',
          selected: [rows[1]]
        })

        expect(wrapper.vm.isRowSelected(rows[1].name)).toBe(true)
        expect(wrapper.vm.isRowSelected(rows[1].id)).toBe(false)
        expect(wrapper.findAll('tbody tr')[1].classes()).toContain('selected')
      })

      test('type Function has effect', () => {
        const rows = getRows()
        const wrapper = mountTable({
          rowKey: row => `key-${row.id}`,
          selection: 'multiple',
          selected: [rows[1]]
        })

        expect(wrapper.vm.isRowSelected('key-2')).toBe(true)
        expect(wrapper.vm.isRowSelected(2)).toBe(false)
        expect(wrapper.findAll('tbody tr')[1].classes()).toContain('selected')
      })
    })

    describe('[(prop)virtual-scroll]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable({
          rows: getBigRows(100),
          pagination: { rowsPerPage: 0 }
        })

        expect(wrapper.find('.q-virtual-scroll').exists()).toBe(false)
        expect(wrapper.findAll('tbody tr')).toHaveLength(100)

        await wrapper.setProps({ virtualScroll: true })
        await flushPromises()

        expect(wrapper.get('.q-table__middle').classes()).toContain(
          'q-virtual-scroll'
        )
        // only a slice of the rows gets rendered
        expect(wrapper.findAll('tbody tr').length).toBeLessThan(100)
      })
    })

    describe('[(prop)virtual-scroll-target]', () => {
      test('type Element has effect', async () => {
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          pagination: { rowsPerPage: 0 }
        })

        // it acts as its own scroll container by default
        expect(wrapper.get('.q-table__middle').classes()).toContain('scroll')

        await wrapper.setProps({ virtualScrollTarget: document.body })
        await flushPromises()

        expect(wrapper.get('.q-table__middle').classes()).not.toContain(
          'scroll'
        )
      })

      test('type String has effect', async () => {
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          pagination: { rowsPerPage: 0 }
        })

        expect(wrapper.get('.q-table__middle').classes()).toContain('scroll')

        await wrapper.setProps({ virtualScrollTarget: 'body' })
        await flushPromises()

        expect(wrapper.get('.q-table__middle').classes()).not.toContain(
          'scroll'
        )
      })
    })

    describe('[(prop)virtual-scroll-slice-size]', () => {
      test('type Number has effect', () => {
        const propVal = 30
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollSliceSize: propVal,
          pagination: { rowsPerPage: 0 }
        })

        // it drives the underlying virtual scroll
        expect(
          wrapper.getComponent(QVirtualScroll).props('virtualScrollSliceSize')
        ).toBe(propVal)
      })

      test('type String has effect', () => {
        const propVal = '30'
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollSliceSize: propVal,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper.getComponent(QVirtualScroll).props('virtualScrollSliceSize')
        ).toBe(propVal)
      })

      test('type null has effect', () => {
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollSliceSize: null,
          pagination: { rowsPerPage: 0 }
        })

        // the underlying virtual scroll computes the slice on its own
        expect(
          wrapper.getComponent(QVirtualScroll).props('virtualScrollSliceSize')
        ).toBe(null)
        expect(wrapper.findAll('tbody tr').length).toBeGreaterThan(0)
      })
    })

    describe('[(prop)virtual-scroll-slice-ratio-before]', () => {
      test('type Number has effect', () => {
        const propVal = 2
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollSliceRatioBefore: propVal,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper
            .getComponent(QVirtualScroll)
            .props('virtualScrollSliceRatioBefore')
        ).toBe(propVal)
      })

      test('type String has effect', () => {
        const propVal = '2'
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollSliceRatioBefore: propVal,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper
            .getComponent(QVirtualScroll)
            .props('virtualScrollSliceRatioBefore')
        ).toBe(propVal)
      })
    })

    describe('[(prop)virtual-scroll-slice-ratio-after]', () => {
      test('type Number has effect', () => {
        const propVal = 2
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollSliceRatioAfter: propVal,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper
            .getComponent(QVirtualScroll)
            .props('virtualScrollSliceRatioAfter')
        ).toBe(propVal)
      })

      test('type String has effect', () => {
        const propVal = '2'
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollSliceRatioAfter: propVal,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper
            .getComponent(QVirtualScroll)
            .props('virtualScrollSliceRatioAfter')
        ).toBe(propVal)
      })
    })

    describe('[(prop)virtual-scroll-item-size]', () => {
      test('type Number has effect', () => {
        const defaultWrapper = mountTable({
          rows: getBigRows(100),
          virtualScroll: true,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          defaultWrapper
            .findAll('.q-virtual-scroll__padding td')[0]
            .attributes('style')
        ).toContain('--q-virtual-scroll-item-height: 48px')

        const wrapper = mountTable({
          rows: getBigRows(100),
          virtualScroll: true,
          virtualScrollItemSize: 100,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper
            .findAll('.q-virtual-scroll__padding td')[0]
            .attributes('style')
        ).toContain('--q-virtual-scroll-item-height: 100px')
      })

      test('type String has effect', () => {
        const wrapper = mountTable({
          rows: getBigRows(100),
          virtualScroll: true,
          virtualScrollItemSize: '100',
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper
            .findAll('.q-virtual-scroll__padding td')[0]
            .attributes('style')
        ).toContain('--q-virtual-scroll-item-height: 100px')
      })
    })

    describe('[(prop)virtual-scroll-sticky-size-start]', () => {
      test('type Number has effect', async () => {
        // scrollTo() offsets the scroll position with the sticky size;
        // jsdom reports offsetTop 0 so the resulting scrollTop is negated
        const wrapper = mountTable({ virtualScrollStickySizeStart: 40 })

        wrapper.vm.scrollTo(3)
        await flushPromises()

        expect(wrapper.get('.q-table__middle.scroll').element.scrollTop).toBe(
          -40
        )
      })

      test('type String has effect', async () => {
        const wrapper = mountTable({ virtualScrollStickySizeStart: '40' })

        wrapper.vm.scrollTo(3)
        await flushPromises()

        expect(wrapper.get('.q-table__middle.scroll').element.scrollTop).toBe(
          -40
        )
      })
    })

    describe('[(prop)virtual-scroll-sticky-size-end]', () => {
      test('type Number has effect', () => {
        const propVal = 20
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollStickySizeEnd: propVal,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper
            .getComponent(QVirtualScroll)
            .props('virtualScrollStickySizeEnd')
        ).toBe(propVal)
      })

      test('type String has effect', () => {
        const propVal = '20'
        const wrapper = mountTable({
          rows: getBigRows(50),
          virtualScroll: true,
          virtualScrollStickySizeEnd: propVal,
          pagination: { rowsPerPage: 0 }
        })

        expect(
          wrapper
            .getComponent(QVirtualScroll)
            .props('virtualScrollStickySizeEnd')
        ).toBe(propVal)
      })
    })

    describe('[(prop)table-colspan]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountTable({ loading: true })

        // by default the loading row spans the number of columns
        expect(wrapper.get('.q-table__progress th').attributes('colspan')).toBe(
          '2'
        )

        await wrapper.setProps({ tableColspan: 10 })

        expect(wrapper.get('.q-table__progress th').attributes('colspan')).toBe(
          '10'
        )
      })

      test('type String has effect', async () => {
        const wrapper = mountTable({ loading: true })

        expect(wrapper.get('.q-table__progress th').attributes('colspan')).toBe(
          '2'
        )

        await wrapper.setProps({ tableColspan: '3' })

        expect(wrapper.get('.q-table__progress th').attributes('colspan')).toBe(
          '3'
        )
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable()

        const navBtn = () => wrapper.findAll('.q-table__bottom .q-btn')[0]
        expect(navBtn().classes()).toContain('text-grey-8')

        await wrapper.setProps({ color: 'primary' })
        await flushPromises()

        expect(navBtn().classes()).toContain('text-primary')
        expect(navBtn().classes()).not.toContain('text-grey-8')
      })
    })

    describe('[(prop)icon-first-page]', () => {
      test('type String has effect', async () => {
        // 20 rows > 2 pages, so first/prev/next/last controls are rendered
        const wrapper = mountTable({ rows: getBigRows(20) })

        const icon = () => wrapper.findAll('.q-table__bottom .q-btn i')[0]
        expect(icon().text()).toBe('first_page')

        await wrapper.setProps({ iconFirstPage: 'map' })

        expect(icon().text()).toBe('map')
      })
    })

    describe('[(prop)icon-prev-page]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable({ rows: getBigRows(20) })

        const icon = () => wrapper.findAll('.q-table__bottom .q-btn i')[1]
        expect(icon().text()).toBe('chevron_left')

        await wrapper.setProps({ iconPrevPage: 'map' })

        expect(icon().text()).toBe('map')
      })
    })

    describe('[(prop)icon-next-page]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable({ rows: getBigRows(20) })

        const icon = () => wrapper.findAll('.q-table__bottom .q-btn i')[2]
        expect(icon().text()).toBe('chevron_right')

        await wrapper.setProps({ iconNextPage: 'map' })

        expect(icon().text()).toBe('map')
      })
    })

    describe('[(prop)icon-last-page]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable({ rows: getBigRows(20) })

        const icon = () => wrapper.findAll('.q-table__bottom .q-btn i')[3]
        expect(icon().text()).toBe('last_page')

        await wrapper.setProps({ iconLastPage: 'map' })

        expect(icon().text()).toBe('map')
      })
    })

    describe('[(prop)grid]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        expect(wrapper.find('table.q-table').exists()).toBe(true)
        expect(wrapper.find('.q-table__grid-item').exists()).toBe(false)

        await wrapper.setProps({ grid: true })

        expect(wrapper.get('.q-table__container').classes()).toContain(
          'q-table--grid'
        )
        expect(wrapper.find('table.q-table').exists()).toBe(false)
        // one card per row of the current page
        expect(wrapper.findAll('.q-table__grid-item')).toHaveLength(5)
      })
    })

    describe('[(prop)grid-header]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable({ grid: true })

        expect(wrapper.find('table.q-table').exists()).toBe(false)

        await wrapper.setProps({ gridHeader: true })

        expect(wrapper.find('table.q-table thead').exists()).toBe(true)
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).not.toContain('q-table--dense')

        await wrapper.setProps({ dense: true })

        expect(target.classes()).toContain('q-table--dense')
      })
    })

    describe('[(prop)columns]', () => {
      test('type Array has effect', async () => {
        // without the prop, columns are inferred from the first row
        const wrapper = mountTable({ columns: void 0 })

        const headerTexts = () =>
          wrapper.findAll('thead th').map(th => th.text())

        expect(headerTexts()).toHaveLength(3)
        expect(headerTexts()[0]).toContain('ID')

        await wrapper.setProps({ columns: defaultColumns })

        expect(headerTexts()).toHaveLength(2)
        expect(headerTexts()[0]).toContain('Dessert')
        expect(headerTexts()[1]).toContain('Calories')
      })
    })

    describe('[(prop)visible-columns]', () => {
      test('type Array has effect', async () => {
        const columns = [
          { ...defaultColumns[0], required: true },
          defaultColumns[1],
          { name: 'id', label: 'Id', field: 'id' }
        ]
        const wrapper = mountTable({ columns })

        expect(wrapper.findAll('thead th')).toHaveLength(3)

        await wrapper.setProps({ visibleColumns: ['calories'] })

        // the required column is always kept
        const headerTexts = wrapper.findAll('thead th').map(th => th.text())
        expect(headerTexts).toHaveLength(2)
        expect(headerTexts[0]).toContain('Dessert')
        expect(headerTexts[1]).toContain('Calories')
      })
    })

    describe('[(prop)loading]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        expect(wrapper.find('.q-table__linear-progress').exists()).toBe(false)

        await wrapper.setProps({ loading: true })

        expect(wrapper.get('.q-table__container').classes()).toContain(
          'q-table--loading'
        )
        expect(wrapper.find('.q-table__linear-progress').exists()).toBe(true)
      })
    })

    describe('[(prop)title]', () => {
      test('type String has effect', async () => {
        const propVal = 'Device list'
        const wrapper = mountTable()

        expect(wrapper.find('.q-table__title').exists()).toBe(false)

        await wrapper.setProps({ title: propVal })

        expect(wrapper.get('.q-table__title').text()).toBe(propVal)
      })
    })

    describe('[(prop)hide-header]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        expect(wrapper.find('thead').exists()).toBe(true)

        await wrapper.setProps({ hideHeader: true })

        expect(wrapper.find('thead').exists()).toBe(false)
      })
    })

    describe('[(prop)hide-bottom]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        expect(wrapper.find('.q-table__bottom').exists()).toBe(true)

        await wrapper.setProps({ hideBottom: true })

        expect(wrapper.find('.q-table__bottom').exists()).toBe(false)
      })
    })

    describe('[(prop)hide-selected-banner]', () => {
      test('type Boolean has effect', async () => {
        const rows = getRows()
        const wrapper = mountTable({
          selection: 'multiple',
          selected: [rows[0]],
          selectedRowsLabel: numberOfRows => `SELECTED:${numberOfRows}`
        })

        expect(wrapper.get('.q-table__bottom').text()).toContain('SELECTED:1')

        await wrapper.setProps({ hideSelectedBanner: true })

        expect(wrapper.get('.q-table__bottom').text()).not.toContain(
          'SELECTED:1'
        )
      })
    })

    describe('[(prop)hide-no-data]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable({ rows: [] })

        expect(wrapper.find('.q-table__bottom--nodata').exists()).toBe(true)

        await wrapper.setProps({ hideNoData: true })

        expect(wrapper.find('.q-table__bottom--nodata').exists()).toBe(false)
      })
    })

    describe('[(prop)hide-pagination]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        expect(wrapper.find('.q-table__bottom').exists()).toBe(true)

        await wrapper.setProps({ hidePagination: true })

        expect(wrapper.find('.q-table__bottom').exists()).toBe(false)
        // the rows themselves are still rendered
        expect(wrapper.findAll('tbody tr').length).toBeGreaterThan(0)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).not.toContain('q-table--dark')

        await wrapper.setProps({ dark: true })

        expect(target.classes()).toEqual(
          expect.arrayContaining([
            'q-table--dark',
            'q-table__card--dark',
            'q-dark'
          ])
        )
      })

      test('type null has effect', async () => {
        const wrapper = mountTable({ dark: true })

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).toContain('q-table--dark')

        await wrapper.setProps({ dark: null })

        // follows the (inactive) Dark plugin
        expect(target.classes()).not.toContain('q-table--dark')
        expect(target.classes()).not.toContain('q-dark')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).not.toContain('q-table--flat')

        await wrapper.setProps({ flat: true })

        expect(target.classes()).toContain('q-table--flat')
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).not.toContain('q-table--bordered')

        await wrapper.setProps({ bordered: true })

        expect(target.classes()).toContain('q-table--bordered')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).not.toContain('q-table--square')

        await wrapper.setProps({ square: true })

        expect(target.classes()).toContain('q-table--square')
      })
    })

    describe('[(prop)separator]', () => {
      test('value "horizontal" has effect', () => {
        const wrapper = mountTable({ separator: 'horizontal' })

        expect(wrapper.get('.q-table__container').classes()).toContain(
          'q-table--horizontal-separator'
        )
      })

      test('value "vertical" has effect', () => {
        const wrapper = mountTable({ separator: 'vertical' })

        expect(wrapper.get('.q-table__container').classes()).toContain(
          'q-table--vertical-separator'
        )
      })

      test('value "cell" has effect', () => {
        const wrapper = mountTable({ separator: 'cell' })

        expect(wrapper.get('.q-table__container').classes()).toContain(
          'q-table--cell-separator'
        )
      })

      test('value "none" has effect', () => {
        const wrapper = mountTable({ separator: 'none' })

        expect(wrapper.get('.q-table__container').classes()).toContain(
          'q-table--none-separator'
        )
      })
    })

    describe('[(prop)wrap-cells]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).toContain('q-table--no-wrap')

        await wrapper.setProps({ wrapCells: true })

        expect(target.classes()).not.toContain('q-table--no-wrap')
      })
    })

    describe('[(prop)binary-state-sort]', () => {
      test('type Boolean has effect', async () => {
        // default cycle is ascending > descending > no sorting
        const wrapper = mountTable()

        wrapper.vm.sort('name')
        await flushPromises()
        expect(getFirstThAriaSort(wrapper)).toBe('ascending')

        wrapper.vm.sort('name')
        await flushPromises()
        expect(getFirstThAriaSort(wrapper)).toBe('descending')

        wrapper.vm.sort('name')
        await flushPromises()
        expect(getFirstThAriaSort(wrapper)).toBe('none')

        // binary mode only toggles between ascending and descending
        const binaryWrapper = mountTable({ binaryStateSort: true })

        binaryWrapper.vm.sort('name')
        await flushPromises()
        expect(getFirstThAriaSort(binaryWrapper)).toBe('ascending')

        binaryWrapper.vm.sort('name')
        await flushPromises()
        expect(getFirstThAriaSort(binaryWrapper)).toBe('descending')

        binaryWrapper.vm.sort('name')
        await flushPromises()
        expect(getFirstThAriaSort(binaryWrapper)).toBe('ascending')
      })
    })

    describe('[(prop)column-sort-order]', () => {
      test('value "ad" has effect', async () => {
        const wrapper = mountTable({ columnSortOrder: 'ad' })

        wrapper.vm.sort('name')
        await flushPromises()

        expect(getFirstThAriaSort(wrapper)).toBe('ascending')
      })

      test('value "da" has effect', async () => {
        const wrapper = mountTable({ columnSortOrder: 'da' })

        wrapper.vm.sort('name')
        await flushPromises()

        expect(getFirstThAriaSort(wrapper)).toBe('descending')
      })
    })

    describe('[(prop)no-data-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'No devices available'
        const wrapper = mountTable({ rows: [] })

        const target = wrapper.get('.q-table__bottom--nodata')
        expect(target.text()).not.toContain(propVal)

        await wrapper.setProps({ noDataLabel: propVal })

        expect(target.text()).toContain(propVal)
      })
    })

    describe('[(prop)no-results-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'No matched records'
        const wrapper = mountTable({ filter: 'zzz-no-match' })

        const target = wrapper.get('.q-table__bottom--nodata')
        expect(target.text()).not.toContain(propVal)

        await wrapper.setProps({ noResultsLabel: propVal })

        expect(target.text()).toContain(propVal)
      })
    })

    describe('[(prop)loading-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Loading devices...'
        const wrapper = mountTable({ rows: [], loading: true })

        const target = wrapper.get('.q-table__bottom--nodata')
        expect(target.text()).not.toContain(propVal)

        await wrapper.setProps({ loadingLabel: propVal })

        expect(target.text()).toContain(propVal)
      })
    })

    describe('[(prop)selected-rows-label]', () => {
      test('type Function has effect', async () => {
        const rows = getRows()
        const wrapper = mountTable({
          selection: 'multiple',
          selected: [rows[0], rows[1]]
        })

        const target = wrapper.get('.q-table__bottom')
        expect(target.text()).not.toContain('Selected: 2 entries')

        await wrapper.setProps({
          selectedRowsLabel: numberOfRows => `Selected: ${numberOfRows} entries`
        })

        expect(target.text()).toContain('Selected: 2 entries')
      })
    })

    describe('[(prop)rows-per-page-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Rows on each page:'
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__bottom')
        expect(target.text()).not.toContain(propVal)

        await wrapper.setProps({ rowsPerPageLabel: propVal })

        expect(target.text()).toContain(propVal)
      })
    })

    describe('[(prop)pagination-label]', () => {
      test('type Function has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__bottom')
        expect(target.text()).not.toContain('1~5~7')

        await wrapper.setProps({
          paginationLabel: (start, end, total) => `${start}~${end}~${total}`
        })

        expect(target.text()).toContain('1~5~7')
      })
    })

    describe('[(prop)table-style]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__middle')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({ tableStyle: 'background-color: #ff0000' })

        expect(target.attributes('style')).toContain('background-color')
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__middle')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({
          tableStyle: ['background-color: #ff0000', 'color: #00ff00']
        })

        expect(target.attributes('style')).toContain('background-color')
        expect(target.attributes('style')).toContain('color')
      })

      test('type Object has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__middle')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({ tableStyle: { backgroundColor: '#ff0000' } })

        expect(target.attributes('style')).toContain('background-color')
      })
    })

    describe('[(prop)table-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-special-class'
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__middle')
        expect(target.classes()).not.toContain(propVal)

        await wrapper.setProps({ tableClass: propVal })

        expect(target.classes()).toContain(propVal)
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__middle')

        await wrapper.setProps({ tableClass: ['my-class-a', 'my-class-b'] })

        expect(target.classes()).toEqual(
          expect.arrayContaining(['my-class-a', 'my-class-b'])
        )
      })

      test('type Object has effect', async () => {
        const propVal = { 'my-special-class': true }
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__middle')
        expect(target.classes()).not.toContain('my-special-class')

        await wrapper.setProps({ tableClass: propVal })

        expect(target.classes()).toContain('my-special-class')
      })
    })

    describe('[(prop)table-header-style]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('thead tr')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({
          tableHeaderStyle: 'background-color: #ff0000'
        })

        expect(target.attributes('style')).toContain('background-color')
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('thead tr')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({
          tableHeaderStyle: ['background-color: #ff0000', 'color: #00ff00']
        })

        expect(target.attributes('style')).toContain('background-color')
        expect(target.attributes('style')).toContain('color')
      })

      test('type Object has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('thead tr')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({
          tableHeaderStyle: { backgroundColor: '#ff0000' }
        })

        expect(target.attributes('style')).toContain('background-color')
      })
    })

    describe('[(prop)table-header-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-special-class'
        const wrapper = mountTable()

        const target = wrapper.get('thead tr')
        expect(target.classes()).not.toContain(propVal)

        await wrapper.setProps({ tableHeaderClass: propVal })

        expect(target.classes()).toContain(propVal)
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('thead tr')

        await wrapper.setProps({
          tableHeaderClass: ['my-class-a', 'my-class-b']
        })

        expect(target.classes()).toEqual(
          expect.arrayContaining(['my-class-a', 'my-class-b'])
        )
      })

      test('type Object has effect', async () => {
        const propVal = { 'my-special-class': true }
        const wrapper = mountTable()

        const target = wrapper.get('thead tr')
        expect(target.classes()).not.toContain('my-special-class')

        await wrapper.setProps({ tableHeaderClass: propVal })

        expect(target.classes()).toContain('my-special-class')
      })
    })

    describe('[(prop)table-row-style-fn]', () => {
      test('type Function has effect', async () => {
        const wrapper = mountTable()

        expect(
          wrapper.findAll('tbody tr').some(tr => tr.attributes('style'))
        ).toBe(false)

        await wrapper.setProps({
          tableRowStyleFn: row =>
            row.calories > 300 ? 'font-weight: bold;' : ''
        })

        const trs = wrapper.findAll('tbody tr')
        // Cupcake (305) and Gingerbread (356) are the only ones on
        // the first page with more than 300 calories
        expect(trs[0].attributes('style')).toBeFalsy()
        expect(trs[3].attributes('style')).toContain('font-weight')
        expect(trs[4].attributes('style')).toContain('font-weight')
      })
    })

    describe('[(prop)table-row-class-fn]', () => {
      test('type Function has effect', async () => {
        const wrapper = mountTable()

        expect(
          wrapper.findAll('tbody tr').some(tr => tr.classes('high-cal'))
        ).toBe(false)

        await wrapper.setProps({
          tableRowClassFn: row => (row.calories > 300 ? 'high-cal' : '')
        })

        const trs = wrapper.findAll('tbody tr')
        expect(trs[0].classes()).not.toContain('high-cal')
        expect(trs[3].classes()).toContain('high-cal')
        expect(trs[4].classes()).toContain('high-cal')
      })
    })

    describe('[(prop)card-container-style]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable({ grid: true })

        const target = wrapper.get('.q-table__grid-content')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({
          cardContainerStyle: 'background-color: #ff0000'
        })

        expect(target.attributes('style')).toContain('background-color')
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable({ grid: true })

        const target = wrapper.get('.q-table__grid-content')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({
          cardContainerStyle: ['background-color: #ff0000', 'color: #00ff00']
        })

        expect(target.attributes('style')).toContain('background-color')
        expect(target.attributes('style')).toContain('color')
      })

      test('type Object has effect', async () => {
        const wrapper = mountTable({ grid: true })

        const target = wrapper.get('.q-table__grid-content')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({
          cardContainerStyle: { backgroundColor: '#ff0000' }
        })

        expect(target.attributes('style')).toContain('background-color')
      })
    })

    describe('[(prop)card-container-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-special-class'
        const wrapper = mountTable({ grid: true })

        const target = wrapper.get('.q-table__grid-content')
        expect(target.classes()).not.toContain(propVal)

        await wrapper.setProps({ cardContainerClass: propVal })

        expect(target.classes()).toContain(propVal)
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable({ grid: true })

        const target = wrapper.get('.q-table__grid-content')

        await wrapper.setProps({
          cardContainerClass: ['my-class-a', 'my-class-b']
        })

        expect(target.classes()).toEqual(
          expect.arrayContaining(['my-class-a', 'my-class-b'])
        )
      })

      test('type Object has effect', async () => {
        const propVal = { 'my-special-class': true }
        const wrapper = mountTable({ grid: true })

        const target = wrapper.get('.q-table__grid-content')
        expect(target.classes()).not.toContain('my-special-class')

        await wrapper.setProps({ cardContainerClass: propVal })

        expect(target.classes()).toContain('my-special-class')
      })
    })

    describe('[(prop)card-style]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({ cardStyle: 'background-color: #ff0000' })

        expect(target.attributes('style')).toContain('background-color')
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({
          cardStyle: ['background-color: #ff0000', 'color: #00ff00']
        })

        expect(target.attributes('style')).toContain('background-color')
        expect(target.attributes('style')).toContain('color')
      })

      test('type Object has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.attributes('style')).toBeUndefined()

        await wrapper.setProps({ cardStyle: { backgroundColor: '#ff0000' } })

        expect(target.attributes('style')).toContain('background-color')
      })
    })

    describe('[(prop)card-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-special-class'
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).not.toContain(propVal)

        await wrapper.setProps({ cardClass: propVal })

        expect(target.classes()).toContain(propVal)
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')

        await wrapper.setProps({ cardClass: ['my-class-a', 'my-class-b'] })

        expect(target.classes()).toEqual(
          expect.arrayContaining(['my-class-a', 'my-class-b'])
        )
      })

      test('type Object has effect', async () => {
        const propVal = { 'my-special-class': true }
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')
        expect(target.classes()).not.toContain('my-special-class')

        await wrapper.setProps({ cardClass: propVal })

        expect(target.classes()).toContain('my-special-class')
      })
    })

    describe('[(prop)card-style-fn]', () => {
      test('type Function has effect', async () => {
        const wrapper = mountTable({ grid: true })

        expect(
          wrapper
            .findAll('.q-table__grid-item-card')
            .some(card => card.attributes('style'))
        ).toBe(false)

        await wrapper.setProps({
          cardStyleFn: row => (row.calories > 300 ? 'font-weight: bold;' : '')
        })

        const cards = wrapper.findAll('.q-table__grid-item-card')
        expect(cards[0].attributes('style')).toBeFalsy()
        expect(cards[3].attributes('style')).toContain('font-weight')
      })
    })

    describe('[(prop)card-class-fn]', () => {
      test('type Function has effect', async () => {
        const wrapper = mountTable({ grid: true })

        expect(
          wrapper
            .findAll('.q-table__grid-item-card')
            .some(card => card.classes('high-cal'))
        ).toBe(false)

        await wrapper.setProps({
          cardClassFn: row => (row.calories > 300 ? 'high-cal' : '')
        })

        const cards = wrapper.findAll('.q-table__grid-item-card')
        expect(cards[0].classes()).not.toContain('high-cal')
        expect(cards[3].classes()).toContain('high-cal')
      })
    })

    describe('[(prop)title-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-special-class'
        const wrapper = mountTable({ title: 'Device list' })

        const target = wrapper.get('.q-table__title')
        expect(target.classes()).not.toContain(propVal)

        await wrapper.setProps({ titleClass: propVal })

        expect(target.classes()).toContain(propVal)
      })

      test('type Array has effect', async () => {
        const wrapper = mountTable({ title: 'Device list' })

        const target = wrapper.get('.q-table__title')

        await wrapper.setProps({ titleClass: ['my-class-a', 'my-class-b'] })

        expect(target.classes()).toEqual(
          expect.arrayContaining(['my-class-a', 'my-class-b'])
        )
      })

      test('type Object has effect', async () => {
        const propVal = { 'text-h1': true }
        const wrapper = mountTable({ title: 'Device list' })

        const target = wrapper.get('.q-table__title')
        expect(target.classes()).not.toContain('text-h1')

        await wrapper.setProps({ titleClass: propVal })

        expect(target.classes()).toContain('text-h1')
      })
    })

    describe('[(prop)filter]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTable()

        expect(wrapper.findAll('tbody tr')).toHaveLength(5)

        await wrapper.setProps({ filter: 'yogurt' })
        await flushPromises()

        expect(getColumnTexts(wrapper)).toEqual(['Frozen Yogurt'])
      })

      test('type Object has effect', async () => {
        // an Object filter needs a custom filterMethod to interpret it
        const wrapper = mountTable({
          filter: { minCalories: 300 },
          filterMethod: (rows, terms) =>
            rows.filter(row => row.calories >= terms.minCalories)
        })
        await flushPromises()

        expect(getColumnTexts(wrapper)).toEqual([
          'Cupcake',
          'Gingerbread',
          'Jelly bean',
          'Lollipop'
        ])
      })
    })

    describe('[(prop)filter-method]', () => {
      test('type Function has effect', async () => {
        const rows = getRows()
        const filterMethod = vi.fn(list => list.slice(0, 1))
        const wrapper = mountTable({ rows, filter: 'car', filterMethod })
        await flushPromises()

        expect(getColumnTexts(wrapper)).toEqual([rows[0].name])
        expect(filterMethod).toHaveBeenCalledWith(
          rows,
          'car',
          expect.any(Array),
          expect.any(Function)
        )
      })
    })

    describe('[(prop)pagination]', () => {
      test('type Object has effect', () => {
        const rows = getRows()

        // page & rowsPerPage control the rendered slice
        const wrapper = mountTable({
          pagination: { page: 2, rowsPerPage: 3 }
        })
        expect(getColumnTexts(wrapper)).toEqual(
          rows.slice(3, 6).map(row => row.name)
        )

        // sortBy/descending control the sorting
        const sorted = mountTable({
          pagination: { sortBy: 'name', descending: false, rowsPerPage: 0 }
        })
        expect(getColumnTexts(sorted)[0]).toBe('Cupcake')
      })
    })

    describe('[(prop)rows-per-page-options]', () => {
      test('type Array has effect', () => {
        // the first option is used as the initial rowsPerPage
        const wrapper = mountTable({ rowsPerPageOptions: [3, 6] })
        expect(wrapper.findAll('tbody tr')).toHaveLength(3)
        expect(wrapper.find('.q-table__select').exists()).toBe(true)

        // a single option hides the rows-per-page selector
        const single = mountTable({ rowsPerPageOptions: [0] })
        expect(single.findAll('tbody tr')).toHaveLength(7)
        expect(single.find('.q-table__select').exists()).toBe(false)
      })
    })

    describe('[(prop)selection]', () => {
      test('value "single" has effect', () => {
        const wrapper = mountTable({ selection: 'single' })

        expect(wrapper.findAll('tbody .q-checkbox')).toHaveLength(5)
        // the header only gets a spacer cell, no "select all" checkbox
        expect(wrapper.findAll('thead th')).toHaveLength(3)
        expect(wrapper.find('thead .q-checkbox').exists()).toBe(false)
      })

      test('value "multiple" has effect', () => {
        const wrapper = mountTable({ selection: 'multiple' })

        expect(wrapper.findAll('tbody .q-checkbox')).toHaveLength(5)
        expect(wrapper.find('thead .q-checkbox').exists()).toBe(true)
      })

      test('value "none" has effect', () => {
        const wrapper = mountTable({ selection: 'none' })

        expect(wrapper.find('.q-checkbox').exists()).toBe(false)
        expect(wrapper.findAll('thead th')).toHaveLength(2)
      })
    })

    describe('[(prop)selected]', () => {
      test('type Array has effect', async () => {
        const rows = getRows()
        const wrapper = mountTable({ selection: 'multiple', selected: [] })

        const trs = () => wrapper.findAll('tbody tr')
        expect(trs().some(tr => tr.classes('selected'))).toBe(false)

        await wrapper.setProps({ selected: [rows[2]] })

        expect(trs()[2].classes()).toContain('selected')
        expect(trs()[0].classes()).not.toContain('selected')
      })
    })

    describe('[(prop)expanded]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountTable({ expanded: [2] })

        expect(wrapper.vm.isRowExpanded(2)).toBe(true)
        expect(wrapper.vm.isRowExpanded(1)).toBe(false)

        await wrapper.setProps({ expanded: [1] })

        expect(wrapper.vm.isRowExpanded(1)).toBe(true)
        expect(wrapper.vm.isRowExpanded(2)).toBe(false)
      })
    })

    describe('[(prop)sort-method]', () => {
      test('type Function has effect', () => {
        const pagination = { sortBy: 'name', descending: false }

        const wrapper = mountTable({ pagination })
        expect(getColumnTexts(wrapper)[0]).toBe('Cupcake')

        const customWrapper = mountTable({
          pagination,
          sortMethod: rows => rows.reverse()
        })
        expect(getColumnTexts(customWrapper)[0]).toBe('Lollipop')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)loading]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {},
          {
            slots: {
              loading: () => slotContent
            }
          }
        )

        // it only gets rendered while loading
        expect(wrapper.html()).not.toContain(slotContent)

        await wrapper.setProps({ loading: true })

        expect(wrapper.html()).toContain(slotContent)
      })
    })

    describe('[(slot)item]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { grid: true, selection: 'multiple' },
          {
            slots: {
              item: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.html()).toContain(slotContent)

        expect(slotScope).toStrictEqual(bodyCommonScopeShape)
      })
    })

    describe('[(slot)body]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {
            selection: 'multiple',
            tableRowStyleFn: () => 'color: red;'
          },
          {
            slots: {
              body: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.html()).toContain(slotContent)

        expect(slotScope).toStrictEqual({
          ...bodyCommonScopeShape,
          __trClass: expect.any(String),
          __trStyle: expect.any(String)
        })
      })
    })

    describe('[(slot)body-cell]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { selection: 'multiple' },
          {
            slots: {
              'body-cell': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.html()).toContain(slotContent)

        expect(slotScope).toStrictEqual({
          ...bodyCommonScopeShape,
          col: expect.any(Object),
          value: expect.anything()
        })
      })
    })

    describe('[(slot)body-cell-[name]]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { selection: 'multiple' },
          {
            slots: {
              'body-cell-calories': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.html()).toContain(slotContent)

        // the slot only replaces its own column's cells
        expect(slotScope.col.name).toBe('calories')
        expect(wrapper.html()).toContain('Frozen Yogurt')

        expect(slotScope).toStrictEqual({
          ...bodyCommonScopeShape,
          col: expect.any(Object),
          value: expect.anything()
        })
      })
    })

    describe('[(slot)header]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { selection: 'multiple' },
          {
            slots: {
              header: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('thead').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual({
          ...headerCommonScopeShape,
          header: expect.any(Boolean)
        })
      })
    })

    describe('[(slot)header-cell]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { selection: 'multiple' },
          {
            slots: {
              'header-cell': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('thead').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual({
          ...headerCommonScopeShape,
          col: expect.any(Object)
        })
      })
    })

    describe('[(slot)header-cell-[name]]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { selection: 'multiple' },
          {
            slots: {
              'header-cell-name': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('thead').text()).toContain(slotContent)

        // the slot only replaces its own column's header cell
        expect(slotScope.col.name).toBe('name')
        expect(wrapper.get('thead').text()).toContain('Calories')

        expect(slotScope).toStrictEqual({
          ...headerCommonScopeShape,
          col: expect.any(Object)
        })
      })
    })

    describe('[(slot)body-selection]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { selection: 'multiple' },
          {
            slots: {
              'body-selection': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('tbody').text()).toContain(slotContent)
        // it replaces the default checkbox
        expect(wrapper.find('tbody .q-checkbox').exists()).toBe(false)

        expect(slotScope).toStrictEqual(bodyCommonScopeShape)
      })
    })

    describe('[(slot)header-selection]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { selection: 'multiple' },
          {
            slots: {
              'header-selection': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('thead').text()).toContain(slotContent)
        // it replaces the default "select all" checkbox
        expect(wrapper.find('thead .q-checkbox').exists()).toBe(false)

        expect(slotScope).toStrictEqual(headerCommonScopeShape)
      })
    })

    describe('[(slot)top-row]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {},
          {
            slots: {
              'top-row': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('tbody').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual({
          cols: expect.any(Array)
        })
      })
    })

    describe('[(slot)bottom-row]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {},
          {
            slots: {
              'bottom-row': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('tbody').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual({
          cols: expect.any(Array)
        })
      })
    })

    describe('[(slot)top]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {},
          {
            slots: {
              top: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('.q-table__top').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual(marginalScopeShape)
      })
    })

    describe('[(slot)bottom]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {},
          {
            slots: {
              bottom: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('.q-table__bottom').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual(marginalScopeShape)
      })
    })

    describe('[(slot)pagination]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {},
          {
            slots: {
              pagination: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('.q-table__bottom').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual(marginalScopeShape)
      })
    })

    describe('[(slot)top-left]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {},
          {
            slots: {
              'top-left': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('.q-table__top').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual(marginalScopeShape)
      })
    })

    describe('[(slot)top-right]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          {},
          {
            slots: {
              'top-right': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('.q-table__top').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual(marginalScopeShape)
      })
    })

    describe('[(slot)top-selection]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { selection: 'multiple', selected: [getRows()[0]] },
          {
            slots: {
              'top-selection': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('.q-table__top').text()).toContain(slotContent)

        expect(slotScope).toStrictEqual(marginalScopeShape)
      })
    })

    describe('[(slot)no-data]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountTable(
          { rows: [], filter: 'find-me' },
          {
            slots: {
              'no-data': scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(wrapper.get('.q-table__bottom--nodata').text()).toContain(
          slotContent
        )

        expect(slotScope).toStrictEqual({
          message: expect.any(String),
          icon: expect.any(String),
          filter: 'find-me'
        })
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)fullscreen]', () => {
      test('is emitting', async () => {
        const wrapper = mountTable()

        await wrapper.setProps({ fullscreen: true })
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('fullscreen')
        expect(eventList.fullscreen).toHaveLength(1)

        const [value] = eventList.fullscreen[0]
        expect(value).toBe(true)

        wrapper.unmount()
      })
    })

    describe('[(event)update:fullscreen]', () => {
      test('is emitting', async () => {
        const wrapper = mountTable()

        await wrapper.setProps({ fullscreen: true })
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:fullscreen')
        expect(eventList['update:fullscreen']).toHaveLength(1)

        const [value] = eventList['update:fullscreen'][0]
        expect(value).toBe(true)

        wrapper.unmount()
      })
    })

    describe('[(event)row-click]', () => {
      test('is emitting', async () => {
        const rows = getRows()
        const wrapper = mountTable({ rows, onRowClick: () => {} })

        await wrapper.findAll('tbody tr')[1].trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('rowClick')
        expect(eventList.rowClick).toHaveLength(1)

        const [evt, row, index] = eventList.rowClick[0]
        expect(evt).toBeInstanceOf(Event)
        expect(row).toEqual(rows[1])
        expect(index).toBe(1)
      })
    })

    describe('[(event)row-dblclick]', () => {
      test('is emitting', async () => {
        const rows = getRows()
        const wrapper = mountTable({ rows, onRowDblclick: () => {} })

        await wrapper.findAll('tbody tr')[1].trigger('dblclick')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('rowDblclick')
        expect(eventList.rowDblclick).toHaveLength(1)

        const [evt, row, index] = eventList.rowDblclick[0]
        expect(evt).toBeInstanceOf(Event)
        expect(row).toEqual(rows[1])
        expect(index).toBe(1)
      })
    })

    describe('[(event)row-contextmenu]', () => {
      test('is emitting', async () => {
        const rows = getRows()
        const wrapper = mountTable({ rows, onRowContextmenu: () => {} })

        await wrapper.findAll('tbody tr')[1].trigger('contextmenu')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('rowContextmenu')
        expect(eventList.rowContextmenu).toHaveLength(1)

        const [evt, row, index] = eventList.rowContextmenu[0]
        expect(evt).toBeInstanceOf(Event)
        expect(row).toEqual(rows[1])
        expect(index).toBe(1)
      })
    })

    describe('[(event)request]', () => {
      test('is emitting', async () => {
        // providing rowsNumber makes the table operate in server-side mode
        const wrapper = mountTable({
          pagination: {
            sortBy: 'name',
            descending: false,
            page: 1,
            rowsPerPage: 5,
            rowsNumber: 7
          },
          filter: 'car'
        })

        wrapper.vm.nextPage()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('request')
        expect(eventList.request).toHaveLength(1)

        const [requestProp] = eventList.request[0]
        expect(requestProp).toStrictEqual({
          pagination: {
            sortBy: 'name',
            descending: false,
            page: 2,
            rowsPerPage: 5,
            rowsNumber: 7
          },
          filter: 'car',
          getCellValue: expect.any(Function)
        })
      })
    })

    describe('[(event)selection]', () => {
      test('is emitting', async () => {
        const rows = getRows()
        const wrapper = mountTable({ selection: 'multiple', selected: [] })

        await wrapper.get('tbody .q-checkbox').trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('selection')
        expect(eventList.selection).toHaveLength(1)

        const [details] = eventList.selection[0]
        expect(details).toStrictEqual({
          rows: [rows[0]],
          keys: [rows[0].id],
          added: true,
          evt: expect.any(Event)
        })
      })
    })

    describe('[(event)update:pagination]', () => {
      test('is emitting', () => {
        const pagination = {
          sortBy: 'name',
          descending: false,
          page: 1,
          rowsPerPage: 5
        }
        const wrapper = mountTable({
          pagination,
          'onUpdate:pagination': () => {}
        })

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:pagination')
        expect(eventList['update:pagination']).toHaveLength(1)

        const [newPagination] = eventList['update:pagination'][0]
        expect(newPagination).toStrictEqual(pagination)
      })
    })

    describe('[(event)update:selected]', () => {
      test('is emitting', async () => {
        const rows = getRows()
        const wrapper = mountTable({ selection: 'multiple', selected: [] })

        await wrapper.get('tbody .q-checkbox').trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:selected')
        expect(eventList['update:selected']).toHaveLength(1)

        const [newSelected] = eventList['update:selected'][0]
        expect(newSelected).toEqual([rows[0]])
      })
    })

    describe('[(event)update:expanded]', () => {
      test('is emitting', () => {
        const wrapper = mountTable({ expanded: [] })

        wrapper.vm.setExpanded([1, 2])

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:expanded')
        expect(eventList['update:expanded']).toHaveLength(1)

        const [newExpanded] = eventList['update:expanded'][0]
        expect(newExpanded).toEqual([1, 2])
      })
    })

    describe('[(event)virtual-scroll]', () => {
      test('is emitting', async () => {
        const wrapper = mountTable({ virtualScrollStickySizeStart: 0 })

        wrapper.vm.scrollTo(3)
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('virtualScroll')
        expect(eventList.virtualScroll).toHaveLength(1)

        const [details] = eventList.virtualScroll[0]
        expect(details).toStrictEqual({
          index: 3,
          from: 0,
          to: 4,
          direction: 'increase'
        })
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)toggleFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')

        expect(wrapper.vm.toggleFullscreen()).toBeUndefined()
        await flushPromises()
        expect(target.classes()).toContain('fullscreen')

        wrapper.vm.toggleFullscreen()
        await flushPromises()
        expect(target.classes()).not.toContain('fullscreen')

        wrapper.unmount()
      })
    })

    describe('[(method)setFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')

        expect(wrapper.vm.setFullscreen()).toBeUndefined()
        await flushPromises()
        expect(target.classes()).toContain('fullscreen')

        wrapper.unmount()
      })
    })

    describe('[(method)exitFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountTable()

        const target = wrapper.get('.q-table__container')

        wrapper.vm.setFullscreen()
        await flushPromises()
        expect(target.classes()).toContain('fullscreen')

        expect(wrapper.vm.exitFullscreen()).toBeUndefined()
        await flushPromises()
        expect(target.classes()).not.toContain('fullscreen')

        wrapper.unmount()
      })
    })

    describe('[(method)requestServerInteraction]', () => {
      test('should be callable', async () => {
        const wrapper = mountTable()

        expect(wrapper.vm.requestServerInteraction()).toBeUndefined()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('request')

        const [requestProp] = eventList.request[0]
        expect(requestProp).toStrictEqual({
          pagination: {
            sortBy: null,
            descending: false,
            page: 1,
            rowsPerPage: 5
          },
          filter: void 0,
          getCellValue: expect.any(Function)
        })
      })
    })

    describe('[(method)setPagination]', () => {
      test('should be callable', async () => {
        const rows = getRows()
        const wrapper = mountTable()

        expect(
          wrapper.vm.setPagination({ page: 2, rowsPerPage: 3 })
        ).toBeUndefined()
        await flushPromises()

        expect(getColumnTexts(wrapper)).toEqual(
          rows.slice(3, 6).map(row => row.name)
        )
      })
    })

    describe('[(method)firstPage]', () => {
      test('should be callable', async () => {
        const rows = getRows()
        const wrapper = mountTable({ pagination: { page: 3, rowsPerPage: 2 } })

        expect(getColumnTexts(wrapper)[0]).toBe(rows[4].name)

        expect(wrapper.vm.firstPage()).toBeUndefined()
        await flushPromises()

        expect(getColumnTexts(wrapper)[0]).toBe(rows[0].name)
      })
    })

    describe('[(method)prevPage]', () => {
      test('should be callable', async () => {
        const rows = getRows()
        const wrapper = mountTable({ pagination: { page: 2, rowsPerPage: 2 } })

        expect(getColumnTexts(wrapper)[0]).toBe(rows[2].name)

        expect(wrapper.vm.prevPage()).toBeUndefined()
        await flushPromises()

        expect(getColumnTexts(wrapper)[0]).toBe(rows[0].name)
      })
    })

    describe('[(method)nextPage]', () => {
      test('should be callable', async () => {
        const rows = getRows()
        const wrapper = mountTable({ pagination: { page: 1, rowsPerPage: 2 } })

        expect(getColumnTexts(wrapper)[0]).toBe(rows[0].name)

        expect(wrapper.vm.nextPage()).toBeUndefined()
        await flushPromises()

        expect(getColumnTexts(wrapper)[0]).toBe(rows[2].name)
      })
    })

    describe('[(method)lastPage]', () => {
      test('should be callable', async () => {
        const rows = getRows()
        const wrapper = mountTable({ pagination: { page: 1, rowsPerPage: 2 } })

        expect(wrapper.vm.lastPage()).toBeUndefined()
        await flushPromises()

        // 7 rows on 2-row pages > the last page holds only the last row
        expect(getColumnTexts(wrapper)).toEqual([rows[6].name])
      })
    })

    describe('[(method)isRowSelected]', () => {
      test('should be callable', () => {
        const rows = getRows()
        const wrapper = mountTable({
          selection: 'multiple',
          selected: [rows[1]]
        })

        expect(wrapper.vm.isRowSelected(rows[1].id)).toBe(true)
        expect(wrapper.vm.isRowSelected(rows[0].id)).toBe(false)
      })
    })

    describe('[(method)clearSelection]', () => {
      test('should be callable', () => {
        const rows = getRows()
        const wrapper = mountTable({
          selection: 'multiple',
          selected: [rows[1]]
        })

        expect(wrapper.vm.clearSelection()).toBeUndefined()

        expect(wrapper.emitted('update:selected')[0]).toEqual([[]])
      })
    })

    describe('[(method)isRowExpanded]', () => {
      test('should be callable', () => {
        const wrapper = mountTable({ expanded: [2] })

        expect(wrapper.vm.isRowExpanded(2)).toBe(true)
        expect(wrapper.vm.isRowExpanded(1)).toBe(false)
      })
    })

    describe('[(method)setExpanded]', () => {
      test('should be callable', () => {
        const wrapper = mountTable()

        expect(wrapper.vm.isRowExpanded(1)).toBe(false)

        expect(wrapper.vm.setExpanded([1, 3])).toBeUndefined()

        expect(wrapper.vm.isRowExpanded(1)).toBe(true)
        expect(wrapper.vm.isRowExpanded(3)).toBe(true)
        expect(wrapper.vm.isRowExpanded(2)).toBe(false)
      })
    })

    describe('[(method)sort]', () => {
      test('should be callable', async () => {
        const wrapper = mountTable()

        expect(wrapper.vm.sort('name')).toBeUndefined()
        await flushPromises()

        expect(getColumnTexts(wrapper)[0]).toBe('Cupcake')

        wrapper.vm.sort('name')
        await flushPromises()

        expect(getColumnTexts(wrapper)[0]).toBe('Lollipop')
      })
    })

    describe('[(method)resetVirtualScroll]', () => {
      test('should be callable', () => {
        const wrapper = mountTable({
          rows: getBigRows(100),
          virtualScroll: true,
          pagination: { rowsPerPage: 0 }
        })

        expect(wrapper.vm.resetVirtualScroll()).toBeUndefined()

        // the virtualized table is still in place after the reset
        expect(wrapper.get('.q-table__middle').classes()).toContain(
          'q-virtual-scroll'
        )
      })
    })

    describe('[(method)scrollTo]', () => {
      test('should be callable', async () => {
        // a negative sticky size makes the (otherwise 0)
        // jsdom scroll position land on a positive value
        const wrapper = mountTable({ virtualScrollStickySizeStart: -100 })

        expect(wrapper.vm.scrollTo(2)).toBeUndefined()
        await flushPromises()

        expect(wrapper.get('.q-table__middle.scroll').element.scrollTop).toBe(
          100
        )
        expect(wrapper.emitted('virtualScroll')[0][0].index).toBe(2)
      })
    })

    describe('[(method)getCellValue]', () => {
      test('should be callable', () => {
        const rows = getRows()
        const wrapper = mountTable({
          columns: [
            { name: 'name', label: 'Dessert', field: row => row.name },
            {
              name: 'calories',
              label: 'Calories',
              field: 'calories',
              format: val => `${val} cal`
            }
          ]
        })

        expect(wrapper.vm.getCellValue('name', rows[0])).toBe(rows[0].name)
        // the column "format" gets applied
        expect(wrapper.vm.getCellValue('calories', rows[0])).toBe('159 cal')
        // unknown column
        expect(wrapper.vm.getCellValue('bogus', rows[0])).toBeUndefined()
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)filteredSortedRows]', () => {
      test('should be exposed', async () => {
        const rows = getRows()
        const wrapper = mountTable()

        expect(wrapper.vm.filteredSortedRows).toEqual(rows)

        await wrapper.setProps({ filter: 'yogurt' })
        await flushPromises()

        expect(wrapper.vm.filteredSortedRows).toEqual([rows[0]])
      })
    })

    describe('[(computedProp)computedRows]', () => {
      test('should be exposed', () => {
        const rows = getRows()
        const wrapper = mountTable()

        // only the current page (default rowsPerPage is 5)
        expect(wrapper.vm.computedRows).toEqual(rows.slice(0, 5))
      })
    })

    describe('[(computedProp)computedRowsNumber]', () => {
      test('should be exposed', () => {
        const wrapper = mountTable()
        expect(wrapper.vm.computedRowsNumber).toBe(7)

        // server-side mode reports the injected rowsNumber
        const serverSide = mountTable({ pagination: { rowsNumber: 100 } })
        expect(serverSide.vm.computedRowsNumber).toBe(100)
      })
    })
  })

  describe('[Generic]', () => {
    // The Quasar stylesheet is loaded into jsdom by testing/vitest.setup.js
    // ("import 'quasar/src/css/index.sass'"), so the border widths below are
    // the ones that QTable.sass actually produces.

    const separatorList = ['horizontal', 'vertical', 'cell', 'none']

    // a hand-written table that a user drops into a slot; it carries no Quasar
    // class, so it must never pick up the parent's separators
    const plainTable =
      '<table>' +
      '<thead><tr><th data-t="slot-th-1"></th><th data-t="slot-th-2"></th></tr></thead>' +
      '<tbody>' +
      '<tr><td data-t="slot-td-1"></td><td data-t="slot-td-2"></td></tr>' +
      '<tr><td></td><td></td></tr>' +
      '</tbody></table>'

    // a nested QMarkupTable that asks for its own vertical separators
    const nestedMarkupTable =
      '<div class="q-markup-table q-table__container q-table--vertical-separator">' +
      '<table class="q-table"><tbody>' +
      '<tr><td data-t="inner-td-1"></td><td data-t="inner-td-2"></td></tr>' +
      '<tr><td></td><td></td></tr>' +
      '</tbody></table></div>'

    function nestedTable(separator) {
      return (
        `<div class="q-table__container q-table--${separator}-separator">` +
        '<div class="q-table__middle"><table class="q-table">' +
        '<thead><tr><th data-t="inner-th-1"></th><th data-t="inner-th-2"></th></tr></thead>' +
        '<tbody>' +
        '<tr><td data-t="inner-td-1"></td><td data-t="inner-td-2"></td></tr>' +
        '<tr><td></td><td></td></tr>' +
        '</tbody></table></div></div>'
      )
    }

    // QTable renders container > .q-table__middle > table
    function createTable(separator, innerHtml = '') {
      return createFixture(
        `<div class="q-table__container q-table--${separator}-separator">` +
          '<div class="q-table__middle"><table class="q-table">' +
          '<thead><tr><th data-t="own-th-1"></th><th data-t="own-th-2"></th></tr></thead>' +
          '<tbody>' +
          '<tr><td data-t="own-td-1"></td><td data-t="own-td-2"></td></tr>' +
          `<tr><td colspan="2">${innerHtml}</td></tr>` +
          '</tbody></table></div></div>'
      )
    }

    // QMarkupTable renders container > table, without the .q-table__middle wrapper
    function createMarkupTable(separator, innerHtml = '') {
      return createFixture(
        '<div class="q-markup-table q-table__container ' +
          `q-table--${separator}-separator"><table class="q-table">` +
          '<thead><tr><th data-t="own-th-1"></th><th data-t="own-th-2"></th></tr></thead>' +
          '<tbody>' +
          '<tr><td data-t="own-td-1"></td><td data-t="own-td-2"></td></tr>' +
          `<tr><td colspan="2">${innerHtml}</td></tr>` +
          '</tbody></table></div>'
      )
    }

    function createFixture(html) {
      const el = document.createElement('div')
      el.innerHTML = html
      document.body.append(el)

      return {
        // data attributes instead of ids: jsdom resolves "#id" through
        // document.getElementById, which picks the wrong node when a previous
        // fixture is still attached
        border(name, side) {
          const target = el.querySelector(`[data-t="${name}"]`)
          expect(
            target,
            `[data-t="${name}"] is missing from the fixture`
          ).not.toBeNull()
          return getComputedStyle(target)[
            side === 'left' ? 'borderLeftWidth' : 'borderBottomWidth'
          ]
        }
      }
    }

    // what the component should draw for its own cells
    function getOwnExpectation(separator) {
      return {
        thLeft:
          separator === 'vertical' || separator === 'cell' ? '1px' : '0px',
        // "thead th" for horizontal/cell, "thead tr:last-child th" for vertical
        thBottom: separator === 'none' ? '0px' : '1px',
        tdLeft:
          separator === 'vertical' || separator === 'cell' ? '1px' : '0px',
        tdBottom:
          separator === 'horizontal' || separator === 'cell' ? '1px' : '0px'
      }
    }

    afterEach(() => {
      document.body.innerHTML = ''
    })

    describe('[separator scoping]', () => {
      describe('[the separators still reach the component own cells]', () => {
        for (const separator of separatorList) {
          test(`QTable separator="${separator}"`, () => {
            const fixture = createTable(separator)
            const expected = getOwnExpectation(separator)

            expect(fixture.border('own-th-2', 'left')).toBe(expected.thLeft)
            expect(fixture.border('own-th-2', 'bottom')).toBe(expected.thBottom)
            expect(fixture.border('own-td-2', 'left')).toBe(expected.tdLeft)
            expect(fixture.border('own-td-2', 'bottom')).toBe(expected.tdBottom)
            // first column never gets a left border
            expect(fixture.border('own-td-1', 'left')).toBe('0px')
          })

          test(`QMarkupTable separator="${separator}"`, () => {
            const fixture = createMarkupTable(separator)
            const expected = getOwnExpectation(separator)

            expect(fixture.border('own-th-2', 'left')).toBe(expected.thLeft)
            expect(fixture.border('own-th-2', 'bottom')).toBe(expected.thBottom)
            expect(fixture.border('own-td-2', 'left')).toBe(expected.tdLeft)
            expect(fixture.border('own-td-2', 'bottom')).toBe(expected.tdBottom)
            expect(fixture.border('own-td-1', 'left')).toBe('0px')
          })
        }
      })

      describe('[a table in a slot does not inherit the separators]', () => {
        for (const separator of separatorList) {
          test(`QTable separator="${separator}"`, () => {
            const fixture = createTable(separator, plainTable)

            for (const name of ['slot-th-2', 'slot-td-2']) {
              expect(fixture.border(name, 'left')).toBe('0px')
              expect(fixture.border(name, 'bottom')).toBe('0px')
            }
          })

          test(`QMarkupTable separator="${separator}"`, () => {
            const fixture = createMarkupTable(separator, plainTable)

            for (const name of ['slot-th-2', 'slot-td-2']) {
              expect(fixture.border(name, 'left')).toBe('0px')
              expect(fixture.border(name, 'bottom')).toBe('0px')
            }
          })
        }
      })

      describe('[a nested table keeps the separators it asks for]', () => {
        for (const separator of separatorList) {
          test(`QMarkupTable separator="vertical" inside separator="${separator}"`, () => {
            const fixture = createTable(separator, nestedMarkupTable)

            expect(fixture.border('inner-td-2', 'left')).toBe('1px')
            expect(fixture.border('inner-td-2', 'bottom')).toBe('0px')
            expect(fixture.border('inner-td-1', 'left')).toBe('0px')
          })
        }

        test('QTable separator="cell" inside separator="none"', () => {
          const fixture = createTable('none', nestedTable('cell'))

          expect(fixture.border('inner-th-2', 'left')).toBe('1px')
          expect(fixture.border('inner-th-2', 'bottom')).toBe('1px')
          expect(fixture.border('inner-td-2', 'left')).toBe('1px')
          expect(fixture.border('inner-td-2', 'bottom')).toBe('1px')
        })

        test('QTable separator="none" inside separator="cell"', () => {
          const fixture = createTable('cell', nestedTable('none'))

          for (const name of ['inner-th-2', 'inner-td-2']) {
            expect(fixture.border(name, 'left')).toBe('0px')
            expect(fixture.border(name, 'bottom')).toBe('0px')
          }
        })
      })
    })
  })
})
