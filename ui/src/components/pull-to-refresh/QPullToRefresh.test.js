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

// a real scroll container
function createScrollContainer(className) {
  const scrollTarget = document.createElement('div')
  if (className !== void 0) scrollTarget.className = className
  scrollTarget.style.cssText = 'height: 50px; overflow: auto;'
  document.body.append(scrollTarget)
  return scrollTarget
}

// a real scroll container with its own content, scrolled 10px down
function createScrollTarget(className) {
  const scrollTarget = createScrollContainer(className)

  const content = document.createElement('div')
  content.style.height = '200px'
  scrollTarget.append(content)

  scrollTarget.scrollTop = 10
  return scrollTarget
}

// mounts the component as the sole content of a real scroll container
// (scrolling both ways)
function mountInScrollContainer(props) {
  const scrollTarget = createScrollContainer('scroll')
  scrollTarget.style.width = '50px'

  const wrapper = mount(QPullToRefresh, {
    props,
    attachTo: scrollTarget,
    slots: {
      default: () => h('div', { style: 'height: 200px; width: 200px' })
    }
  })

  return { wrapper, scrollTarget }
}

function disarmed(wrapper) {
  return vi.waitFor(() => {
    expect(getPanContext(wrapper).handler).toBeUndefined()
  })
}

function getPanContext(wrapper) {
  return wrapper.get('.q-pull-to-refresh').element.__qtouchpan
}

// TouchPan is armed once the observer reports the content's edge on screen
function armed(wrapper) {
  return vi.waitFor(() => {
    expect(getPanContext(wrapper).handler).toBeTypeOf('function')
  })
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
      test('type Boolean has effect', async () => {
        // without touch support, TouchPan does not bind at all when noMouse
        // is set; pretend the device has touch so that the pan context exists
        // and only the mousedown binding differs
        const origTouch = client.has.touch
        client.has.touch = true

        try {
          const withMouse = mountPullToRefresh()
          const withoutMouse = mountPullToRefresh({ noMouse: true })
          const press = { bubbles: true, button: 0, cancelable: true }

          await armed(withMouse)
          await armed(withoutMouse)

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

    describe('[(prop)side]', () => {
      // the pull goes from the side towards the inside of the content
      // (never the other way), while the scroll target sits at that side
      // (and not at the far edge of the axis)
      const sides = {
        top: { direction: 'down', wrong: 'up', away: 'bottom' },
        bottom: { direction: 'up', wrong: 'down', away: 'top' },
        left: { direction: 'right', wrong: 'left', away: 'right' },
        right: { direction: 'left', wrong: 'right', away: 'left' }
      }

      async function scrollTo(scrollTarget, side) {
        scrollTarget.scrollTop = side === 'bottom' ? 1000 : 0
        scrollTarget.scrollLeft = side === 'right' ? 1000 : 0
        await nextTick()
      }

      async function expectSide(side) {
        const { direction, wrong, away } = sides[side]
        const { wrapper, scrollTarget } = mountInScrollContainer({ side })

        expect(getPanContext(wrapper).direction[direction]).toBe(true)
        expect(wrapper.get('.q-pull-to-refresh').classes()).toContain(
          `q-pull-to-refresh--${side}`
        )

        await scrollTo(scrollTarget, away)
        await disarmed(wrapper)

        await scrollTo(scrollTarget, side)
        await armed(wrapper)

        expect(pan(wrapper, { isFirst: true, direction: wrong })).toBe(false)
        expect(
          wrapper.get('.q-pull-to-refresh__content').classes()
        ).not.toContain('no-pointer-events')

        // scrolled a bit away from the side, the right gesture is refused too
        const axis =
          away === 'top' || away === 'bottom' ? 'scrollTop' : 'scrollLeft'
        scrollTarget[axis] += away === 'bottom' || away === 'right' ? 10 : -10
        expect(pan(wrapper, { isFirst: true, direction })).toBe(false)

        await scrollTo(scrollTarget, side)
        expect(pan(wrapper, { isFirst: true, direction })).not.toBe(false)
        await nextTick()

        expect(wrapper.get('.q-pull-to-refresh__content').classes()).toContain(
          'no-pointer-events'
        )

        // the container spans the pulled side of what the scroll
        // container shows of the (larger) content
        const { style } = wrapper.get(
          '.q-pull-to-refresh__puller-container'
        ).element
        const visible = scrollTarget.getBoundingClientRect()
        const doc = document.documentElement
        const expected = {
          top: visible.top + scrollTarget.clientTop,
          left: visible.left + scrollTarget.clientLeft,
          bottom:
            doc.clientHeight -
            (visible.top + scrollTarget.clientTop + scrollTarget.clientHeight),
          right:
            doc.clientWidth -
            (visible.left + scrollTarget.clientLeft + scrollTarget.clientWidth)
        }
        expect(Number.parseFloat(style[side])).toBeCloseTo(expected[side], 3)
        expect(style[away]).toBe('')
        if (side === 'top' || side === 'bottom') {
          expect(Number.parseFloat(style.left)).toBeCloseTo(expected.left, 3)
          expect(Number.parseFloat(style.width)).toBeCloseTo(
            scrollTarget.clientWidth,
            3
          )
        } else {
          expect(Number.parseFloat(style.top)).toBeCloseTo(expected.top, 3)
          expect(Number.parseFloat(style.height)).toBeCloseTo(
            scrollTarget.clientHeight,
            3
          )
        }

        pan(wrapper, { isFinal: true })
        await nextTick()

        wrapper.unmount()
        scrollTarget.remove()
      }

      test('type String has effect', async () => {
        for (const side of Object.keys(sides)) {
          await expectSide(side)
        }
      })

      test('defaults to top', () => {
        const wrapper = mountPullToRefresh()

        expect(getPanContext(wrapper).direction.down).toBe(true)
        expect(wrapper.get('.q-pull-to-refresh').classes()).toContain(
          'q-pull-to-refresh--top'
        )
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPullToRefresh({ disable: true })
        const target = wrapper.get('.q-pull-to-refresh')

        await target.trigger('mousedown', { button: 0 })

        expect(getPanContext(wrapper).event).toBeUndefined()

        await wrapper.setProps({ disable: false })
        await armed(wrapper)
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

        await armed(wrapper)
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
        await armed(wrapper)

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
        await armed(wrapper)

        expect(startPull(wrapper)).toBe(false)
        expect(
          wrapper.get('.q-pull-to-refresh__content').classes()
        ).not.toContain('no-pointer-events')

        wrapper.unmount()
        scrollTarget.remove()
      })

      test('type ComponentInstance has effect', async () => {
        // the instance stands for its root element, a scroll container
        // scrolled 10px down
        const holder = mount(
          {
            // closed, as a script setup component is: its ref is the expose proxy
            setup(_, { expose }) {
              expose({})
              return () =>
                h('div', { style: 'height: 50px; overflow: auto;' }, [
                  h('div', { style: 'height: 200px' })
                ])
            }
          },
          { attachTo: document.body }
        )
        holder.element.scrollTop = 10

        const wrapper = mountPullToRefresh({ scrollTarget: holder.vm })
        await armed(wrapper)

        expect(startPull(wrapper)).toBe(false)
        expect(
          wrapper.get('.q-pull-to-refresh__content').classes()
        ).not.toContain('no-pointer-events')

        wrapper.unmount()
        holder.unmount()
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
      test('should be callable', async () => {
        const scrollTarget = createScrollTarget()

        const wrapper = mountPullToRefresh({ scrollTarget })
        await armed(wrapper)

        expect(wrapper.vm.updateScrollTarget()).toBeUndefined()
        expect(startPull(wrapper)).toBe(false)

        wrapper.unmount()
        scrollTarget.remove()
      })
    })
  })

  describe('[Generic]', () => {
    test('TouchPan stays disarmed while the content edge is scrolled out of view', async () => {
      const { wrapper, scrollTarget } = mountInScrollContainer()

      await armed(wrapper)

      scrollTarget.scrollTop = 10
      await disarmed(wrapper)

      scrollTarget.scrollTop = 0
      await armed(wrapper)

      wrapper.unmount()
      scrollTarget.remove()
    })

    test('the moves of a pull do not re-render the content', async () => {
      const contentRenders = vi.fn(() => h('span', 'Content'))
      const wrapper = mountPullToRefresh({}, { default: contentRenders })

      await armed(wrapper)
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
