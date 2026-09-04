import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'

import ScrollFire from './ScrollFire.js'

// the directive shares the pooled IntersectionObserver, so every test
// must give its element back or the next test would reuse this one's
enableAutoUnmount(afterEach)

// a 200px scroll container with a 400px spacer above the watched
// elements (each 100px tall): at scrollTop 250 the first one is half
// visible, at 350 fully visible, at 0 hidden
function mountScroller(observed) {
  const TestComponent = defineComponent({
    render: () =>
      h('div', { class: 'area', style: 'height: 200px; overflow: auto' }, [
        h('div', { style: 'height: 400px' }),
        ...observed.map(([id, value, arg]) =>
          withDirectives(h('div', { id, style: 'height: 100px' }), [
            [ScrollFire, value, arg]
          ])
        ),
        h('div', { style: 'height: 400px' })
      ])
  })

  const wrapper = mount(TestComponent, { attachTo: document.body })

  return { wrapper, area: wrapper.element }
}

// an observer of the test's own on the same element, so a test can
// wait until the browser has delivered the entries for a scroll
// position before asserting that the directive did NOT fire
function probe(el) {
  const seen = []
  const observer = new IntersectionObserver(entries => {
    seen.push(...entries.map(entry => entry.isIntersecting))
  })
  observer.observe(el)

  return async expected => {
    await vi.waitFor(() => expect(seen.at(-1)).toBe(expected))
    seen.length = 0
  }
}

describe('[ScrollFire API]', () => {
  describe('[Value]', () => {
    test('as Function', async () => {
      const handler = vi.fn()
      const { wrapper, area } = mountScroller([['el', handler]])
      const el = wrapper.get('#el').element
      const delivered = probe(el)

      await delivered(false)
      expect(handler).not.toHaveBeenCalled()

      area.scrollTop = 250
      await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1))
      expect(handler).toHaveBeenCalledWith(el)

      // once: the element is no longer watched
      expect(el.__qintersection).toBeUndefined()

      area.scrollTop = 0
      await delivered(false)
      area.scrollTop = 250
      await delivered(true)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('as undefined', async () => {
      const { wrapper, area } = mountScroller([['el', void 0]])
      const el = wrapper.get('#el').element
      const delivered = probe(el)

      expect(el.__qintersection).toBeUndefined()

      area.scrollTop = 250
      await delivered(true)

      expect(el.__qintersection).toBeUndefined()
    })

    test('fires without scrolling when the element is already in view', async () => {
      const handler = vi.fn()
      const TestComponent = defineComponent({
        render: () =>
          withDirectives(h('div', { id: 'el' }), [[ScrollFire, handler]])
      })

      const wrapper = mount(TestComponent)

      await vi.waitFor(() =>
        expect(handler).toHaveBeenCalledWith(wrapper.element)
      )
    })

    test('re-arms after firing only through a disabled state', async () => {
      const first = vi.fn()
      const second = vi.fn()
      const value = ref(first)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[ScrollFire, value.value]])
      })

      const wrapper = mount(TestComponent)

      await vi.waitFor(() => expect(first).toHaveBeenCalledTimes(1))

      // a new function alone does not fire again
      value.value = second
      await flushPromises()
      expect(wrapper.element.__qintersection).toBeUndefined()

      value.value = void 0
      await flushPromises()
      value.value = second
      await flushPromises()

      await vi.waitFor(() => expect(second).toHaveBeenCalledTimes(1))
      expect(first).toHaveBeenCalledTimes(1)
    })
  })

  describe('[Argument]', () => {
    test('has effect', async () => {
      const anyPart = vi.fn()
      const fully = vi.fn()
      const { wrapper, area } = mountScroller([
        ['any', anyPart],
        ['full', fully, '1']
      ])
      const fullEl = wrapper.get('#full').element
      const delivered = probe(fullEl)

      await delivered(false)

      // 250: #any half visible, #full still hidden; 350: #any fully
      // visible, #full half visible
      area.scrollTop = 350
      await vi.waitFor(() => expect(anyPart).toHaveBeenCalledTimes(1))
      await delivered(true)
      expect(fully).not.toHaveBeenCalled()

      area.scrollTop = 450
      await vi.waitFor(() => expect(fully).toHaveBeenCalledWith(fullEl))
    })

    test('a changed threshold is applied in place', async () => {
      const handler = vi.fn()
      const threshold = ref('1')
      const TestComponent = defineComponent({
        render: () =>
          h('div', { class: 'area', style: 'height: 200px; overflow: auto' }, [
            h('div', { style: 'height: 400px' }),
            withDirectives(h('div', { id: 'el', style: 'height: 100px' }), [
              [ScrollFire, handler, threshold.value]
            ]),
            h('div', { style: 'height: 400px' })
          ])
      })

      const wrapper = mount(TestComponent, { attachTo: document.body })
      const el = wrapper.get('#el').element
      const delivered = probe(el)

      wrapper.element.scrollTop = 250
      await delivered(true)
      expect(handler).not.toHaveBeenCalled()

      threshold.value = '0'
      await flushPromises()

      await vi.waitFor(() => expect(handler).toHaveBeenCalledWith(el))
    })
  })

  describe('[Generic]', () => {
    test('ignores the scroll container and clips to what the user can see', async () => {
      // the container itself is scrolled out of the viewport: the
      // element is inside the container's visible box but off-screen
      const handler = vi.fn()
      const TestComponent = defineComponent({
        render: () =>
          h('div', { style: 'height: 3000px' }, [
            h('div', { style: 'height: 2000px' }),
            h(
              'div',
              { class: 'area', style: 'height: 200px; overflow: auto' },
              [
                withDirectives(h('div', { id: 'el', style: 'height: 100px' }), [
                  [ScrollFire, handler]
                ]),
                h('div', { style: 'height: 400px' })
              ]
            )
          ])
      })

      const wrapper = mount(TestComponent, { attachTo: document.body })
      const el = wrapper.get('#el').element
      const delivered = probe(el)

      await delivered(false)
      expect(handler).not.toHaveBeenCalled()

      window.scrollTo(0, 2000)
      await vi.waitFor(() => expect(handler).toHaveBeenCalledWith(el))

      window.scrollTo(0, 0)
    })

    test('stops watching on unmount', async () => {
      const handler = vi.fn()
      const { wrapper } = mountScroller([['el', handler]])
      const el = wrapper.get('#el').element
      const delivered = probe(el)

      await delivered(false)
      expect(el.__qintersection).toBeDefined()

      wrapper.unmount()

      expect(el.__qintersection).toBeUndefined()
      expect(el.__qscrollfire).toBeUndefined()
      expect(handler).not.toHaveBeenCalled()
    })
  })
})
