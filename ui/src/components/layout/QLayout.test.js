import { defineComponent, h, inject } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { layoutKey } from '../../utils/private.symbols/symbols.js'
import QHeader from '../header/QHeader.js'
import QPageContainer from '../page/QPageContainer.js'
import QToolbar from '../toolbar/QToolbar.js'
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

afterEach(() => {
  window.scrollTo(0, 0)
})

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

        // the layout measures itself (debounced) through a ResizeObserver
        wrapper.element.style.height = `${size.height}px`
        wrapper.element.style.width = `${size.width}px`

        await vi.waitFor(() => {
          expect(wrapper.emitted('resize').at(-1)).toStrictEqual([size])
        })
      })
    })

    describe('[(event)scroll]', () => {
      test('is emitting', async () => {
        const wrapper = mountLayout(
          { onScroll: () => {} },
          { default: () => h('div', { style: 'height: 3000px' }) }
        )

        // a standard layout is scrolled by the window
        window.scrollTo(0, 12)
        window.dispatchEvent(new Event('scroll'))

        await vi.waitFor(() => {
          expect(wrapper.emitted('scroll')).toStrictEqual([
            [
              {
                delta: 12,
                direction: 'down',
                directionChanged: false,
                inflectionPoint: 0,
                position: 12
              }
            ]
          ])
        })
      })
    })

    describe('[(event)scroll-height]', () => {
      test('is emitting', async () => {
        const wrapper = mountLayout({ onScrollHeight: () => {} })

        wrapper.element.style.height = '900px'

        await vi.waitFor(() => {
          expect(wrapper.emitted('scrollHeight').at(-1)).toStrictEqual([900])
        })
      })
    })
  })

  describe('[Generic]', () => {
    test('page container follows padding added on the header itself', async () => {
      const wrapper = mount(QLayout, {
        attachTo: document.body,
        props: { view: 'hHh lpR fFf' },
        slots: {
          default: () => [
            h(QHeader, null, () => h(QToolbar, null, () => 'Title')),
            h(QPageContainer, null, () => h('div', { style: 'height: 2000px' }))
          ]
        }
      })

      const header = wrapper.find('.q-header').element
      const toolbar = wrapper.find('.q-toolbar').element
      const pageContainer = wrapper.find('.q-page-container').element

      // a content-box change is always observed; waiting for it to land
      // settles the observer's debounce so the padding step below stands alone
      toolbar.style.height = '80px'

      await vi.waitFor(() => {
        expect(pageContainer.style.paddingTop).toBe('80px')
      })

      const initialHeight = header.offsetHeight
      expect(initialHeight).toBe(80)

      // the shape of a user-land env(safe-area-inset-top) rule on .q-header
      header.style.paddingTop = '44px'
      expect(header.offsetHeight).toBe(initialHeight + 44)

      await vi.waitFor(() => {
        expect(pageContainer.style.paddingTop).toBe(`${initialHeight + 44}px`)
      })

      wrapper.unmount()
    })
  })
})
