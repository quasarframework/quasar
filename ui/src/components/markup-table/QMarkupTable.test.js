import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QMarkupTable from './QMarkupTable.js'

async function expectBooleanClass(prop, className) {
  const wrapper = mount(QMarkupTable)
  const target = wrapper.get('.q-markup-table')

  expect(target.classes()).not.toContain(className)

  await wrapper.setProps({ [prop]: true })

  expect(target.classes()).toContain(className)
}

function expectSeparator(separator) {
  const wrapper = mount(QMarkupTable, {
    props: { separator }
  })

  expect(wrapper.get('.q-markup-table').classes()).toContain(
    `q-table--${separator}-separator`
  )
}

describe('[QMarkupTable API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('dense', 'q-table--dense')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QMarkupTable)
        const target = wrapper.get('.q-markup-table')

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
        const wrapper = mount(QMarkupTable, {
          props: {
            dark: true
          }
        })
        const target = wrapper.get('.q-markup-table')

        expect(target.classes()).toContain('q-table--dark')

        await wrapper.setProps({ dark: null })

        expect(target.classes()).not.toContain('q-table--dark')
        expect(target.classes()).not.toContain('q-dark')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('flat', 'q-table--flat')
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('bordered', 'q-table--bordered')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('square', 'q-table--square')
      })
    })

    describe('[(prop)separator]', () => {
      test('value "horizontal" has effect', () => {
        expectSeparator('horizontal')
      })

      test('value "vertical" has effect', () => {
        expectSeparator('vertical')
      })

      test('value "cell" has effect', () => {
        expectSeparator('cell')
      })

      test('value "none" has effect', () => {
        expectSeparator('none')
      })
    })

    describe('[(prop)wrap-cells]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QMarkupTable)
        const target = wrapper.get('.q-markup-table')

        expect(target.classes()).toContain('q-table--no-wrap')

        await wrapper.setProps({ wrapCells: true })

        expect(target.classes()).not.toContain('q-table--no-wrap')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QMarkupTable, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('table.q-table').text()).toContain(slotContent)
      })
    })
  })
})
