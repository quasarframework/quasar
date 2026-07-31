import { defineComponent, h, inject, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import { layoutKey } from '../../utils/private.symbols/symbols.js'
import QLayout from './QLayout.js'

const LayoutProbe = defineComponent({
  name: 'LayoutProbe',
  setup() {
    const layout = inject(layoutKey)

    return () =>
      h('div', { class: 'layout-probe' }, JSON.stringify(layout.rows.value))
  }
})

function mountLayout(props = {}, slots = {}) {
  return mount(QLayout, {
    props,
    slots
  })
}

describe('[QLayout API]', () => {
  describe('[Props]', () => {
    describe('[(prop)view]', () => {
      test('type String has effect', () => {
        const wrapper = mountLayout(
          { view: 'hHr lpR fFr' },
          { default: () => h(LayoutProbe) }
        )

        expect(wrapper.get('.layout-probe').text()).toBe(
          JSON.stringify({
            top: ['h', 'h', 'r'],
            middle: ['l', 'p', 'r'],
            bottom: ['f', 'f', 'r']
          })
        )
      })
    })

    describe('[(prop)container]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountLayout({ container: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-layout-container', 'overflow-hidden'])
        )
        expect(wrapper.get('.q-layout').classes()).toContain(
          'q-layout--containerized'
        )
        expect(wrapper.get('.q-layout').$style('min-height')).toBe('')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountLayout(
          {},
          { default: () => 'Layout page content' }
        )

        expect(wrapper.get('.q-layout').text()).toContain('Layout page content')
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)resize]', () => {
      test('is emitting', async () => {
        const wrapper = mountLayout({ onResize: () => {} })
        const size = { height: 900, width: 700 }

        wrapper
          .getComponent({ name: 'QResizeObserver' })
          .vm.$emit('resize', size)
        await nextTick()

        expect(wrapper.emitted('resize')).toStrictEqual([[size]])
      })
    })

    describe('[(event)scroll]', () => {
      test('is emitting', async () => {
        const wrapper = mountLayout({ onScroll: () => {} })

        wrapper.getComponent({ name: 'QScrollObserver' }).vm.$emit('scroll', {
          delta: { top: 3 },
          direction: 'down',
          directionChanged: true,
          inflectionPoint: { top: 4 },
          position: { top: 12 }
        })
        await nextTick()

        expect(wrapper.emitted('scroll')).toStrictEqual([
          [
            {
              delta: 3,
              direction: 'down',
              directionChanged: true,
              inflectionPoint: 4,
              position: 12
            }
          ]
        ])
      })
    })

    describe('[(event)scroll-height]', () => {
      test('is emitting', async () => {
        const wrapper = mountLayout({ onScrollHeight: () => {} })

        wrapper
          .getComponent({ name: 'QResizeObserver' })
          .vm.$emit('resize', { height: 900, width: 700 })
        await nextTick()

        expect(wrapper.emitted('scrollHeight')).toStrictEqual([[900]])
      })
    })
  })
})
