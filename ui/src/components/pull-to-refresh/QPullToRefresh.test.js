import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import { client } from '../../plugins/platform/Platform.js'
import QPullToRefresh from './QPullToRefresh.js'

function mountPullToRefresh(props = {}, slots = {}) {
  return mount(QPullToRefresh, {
    props,
    slots
  })
}

// a real scroll container, scrolled 10px down
function createScrollTarget(className) {
  const scrollTarget = document.createElement('div')
  if (className !== void 0) scrollTarget.className = className
  scrollTarget.style.cssText = 'height: 50px; overflow: auto;'

  const content = document.createElement('div')
  content.style.height = '200px'
  scrollTarget.append(content)

  document.body.append(scrollTarget)
  scrollTarget.scrollTop = 10
  return scrollTarget
}

function getPanContext(wrapper) {
  return wrapper.get('.q-pull-to-refresh').element.__qtouchpan
}

function pan(wrapper, payload) {
  return getPanContext(wrapper).handler({
    direction: 'down',
    distance: { x: 0, y: 30 },
    evt: new Event('touchmove', { cancelable: true }),
    isFirst: false,
    isFinal: false,
    ...payload
  })
}

function startPull(wrapper) {
  return pan(wrapper, { isFirst: true })
}

describe('[QPullToRefresh API]', () => {
  describe('[Props]', () => {
    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountPullToRefresh({ color: 'primary' })

        expect(wrapper.get('.q-icon').classes()).toContain('text-primary')
      })
    })

    describe('[(prop)bg-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountPullToRefresh({ bgColor: 'primary' })

        expect(wrapper.get('.q-pull-to-refresh__puller').classes()).toContain(
          'bg-primary'
        )
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountPullToRefresh({ icon: 'map' })

        expect(wrapper.get('.q-icon').text()).toBe('map')
      })
    })

    describe('[(prop)no-mouse]', () => {
      test('type Boolean has effect', () => {
        // without touch support, TouchPan does not bind at all when noMouse
        // is set; pretend the device has touch so that the pan context exists
        // and only the mousedown binding differs
        const origTouch = client.has.touch
        client.has.touch = true

        try {
          const withMouse = mountPullToRefresh()
          const withoutMouse = mountPullToRefresh({ noMouse: true })
          const press = { bubbles: true, button: 0, cancelable: true }

          withMouse
            .get('.q-pull-to-refresh')
            .element.dispatchEvent(new MouseEvent('mousedown', press))
          withoutMouse
            .get('.q-pull-to-refresh')
            .element.dispatchEvent(new MouseEvent('mousedown', press))

          expect(getPanContext(withMouse).event).toBeDefined()
          expect(getPanContext(withoutMouse).event).toBeUndefined()

          document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
        } finally {
          client.has.touch = origTouch
        }
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPullToRefresh({ disable: true })
        const target = wrapper.get('.q-pull-to-refresh')

        await target.trigger('mousedown', { button: 0 })

        expect(getPanContext(wrapper).event).toBeUndefined()

        await wrapper.setProps({ disable: false })
        await target.trigger('mousedown', { button: 0 })

        expect(getPanContext(wrapper).event).toBeDefined()

        wrapper.unmount()
      })

      test('toggling it keeps the content mounted', async () => {
        const unmountedFn = vi.fn()
        const Probe = defineComponent({
          name: 'ContentProbe',
          unmounted: unmountedFn,
          render: () => h('span', 'Content')
        })

        const wrapper = mountPullToRefresh({}, { default: () => h(Probe) })
        const contentEl = wrapper.get('span').element

        await wrapper.setProps({ disable: true })

        expect(unmountedFn).not.toHaveBeenCalled()
        expect(wrapper.get('span').element).toBe(contentEl)

        await wrapper.setProps({ disable: false })

        expect(unmountedFn).not.toHaveBeenCalled()
        expect(wrapper.get('span').element).toBe(contentEl)

        startPull(wrapper)
        await nextTick()

        expect(wrapper.get('.q-pull-to-refresh__content').classes()).toContain(
          'no-pointer-events'
        )
      })
    })

    describe('[(prop)scroll-target]', () => {
      test('type Element has effect', async () => {
        const scrollTarget = createScrollTarget()

        const wrapper = mountPullToRefresh({ scrollTarget })
        await nextTick()

        expect(startPull(wrapper)).toBe(false)
        expect(
          wrapper.get('.q-pull-to-refresh__content').classes()
        ).not.toContain('no-pointer-events')

        wrapper.unmount()
        scrollTarget.remove()
      })

      test('type String has effect', async () => {
        const scrollTarget = createScrollTarget('pull-scroll-target')

        const wrapper = mountPullToRefresh({
          scrollTarget: '.pull-scroll-target'
        })
        await nextTick()

        expect(startPull(wrapper)).toBe(false)
        expect(
          wrapper.get('.q-pull-to-refresh__content').classes()
        ).not.toContain('no-pointer-events')

        wrapper.unmount()
        scrollTarget.remove()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountPullToRefresh(
          {},
          { default: () => 'Refreshable content' }
        )

        expect(wrapper.get('.q-pull-to-refresh__content').text()).toBe(
          'Refreshable content'
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)refresh]', () => {
      test('is emitting', () => {
        const wrapper = mountPullToRefresh()

        wrapper.vm.trigger()

        expect(wrapper.emitted('refresh')).toHaveLength(1)
        expect(wrapper.emitted('refresh')[0][0]).toBeTypeOf('function')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)trigger]', () => {
      test('should be callable', () => {
        const wrapper = mountPullToRefresh()

        expect(wrapper.vm.trigger()).toBeUndefined()
        expect(wrapper.emitted('refresh')).toHaveLength(1)
      })
    })

    describe('[(method)updateScrollTarget]', () => {
      test('should be callable', () => {
        const scrollTarget = createScrollTarget()

        const wrapper = mountPullToRefresh({ scrollTarget })

        expect(wrapper.vm.updateScrollTarget()).toBeUndefined()
        expect(startPull(wrapper)).toBe(false)

        wrapper.unmount()
        scrollTarget.remove()
      })
    })
  })

  describe('[Generic]', () => {
    test('the moves of a pull do not re-render the content', async () => {
      const contentRenders = vi.fn(() => h('span', 'Content'))
      const wrapper = mountPullToRefresh({}, { default: contentRenders })

      startPull(wrapper)
      await nextTick()

      const rendersOnceStarted = contentRenders.mock.calls.length
      const puller = wrapper.get('.q-pull-to-refresh__puller')
      const transform = puller.element.style.transform

      for (let y = 40; y <= 100; y += 20) {
        pan(wrapper, { distance: { x: 0, y } })
        await nextTick()
      }

      expect(puller.element.style.transform).not.toBe(transform)
      expect(contentRenders).toHaveBeenCalledTimes(rendersOnceStarted)

      pan(wrapper, { isFinal: true })
      await nextTick()
    })
  })
})
