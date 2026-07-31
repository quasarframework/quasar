import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import QInfiniteScroll from './QInfiniteScroll.js'

const targets = []
const wrappers = []

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  targets.splice(0).forEach(target => target.remove())
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function createScrollTarget(id) {
  const target = document.createElement('div')
  if (id !== void 0) target.id = id

  Object.defineProperty(target, 'scrollHeight', {
    configurable: true,
    value: 1000
  })
  target.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100
  })

  document.body.append(target)
  targets.push(target)
  return target
}

function mountInfiniteScroll(
  props = {},
  slots = {},
  target = createScrollTarget()
) {
  const wrapper = mount(QInfiniteScroll, {
    props: {
      debounce: 0,
      scrollTarget: target,
      ...props
    },
    slots,
    attachTo: document.body
  })

  wrappers.push(wrapper)
  return { target, wrapper }
}

describe('[QInfiniteScroll API]', () => {
  describe('[Props]', () => {
    describe('[(prop)offset]', () => {
      test('type Number has effect', () => {
        const target = createScrollTarget()
        target.scrollTop = 350

        const { wrapper } = mountInfiniteScroll({ offset: 550 }, {}, target)

        expect(wrapper.emitted('load')).toHaveLength(1)
      })
    })

    describe('[(prop)debounce]', () => {
      test('type String has effect', () => {
        vi.useFakeTimers()
        const { target, wrapper } = mountInfiniteScroll({ debounce: '50' })

        target.scrollTop = 450
        target.dispatchEvent(new Event('scroll'))

        expect(wrapper.emitted()).not.toHaveProperty('load')

        vi.advanceTimersByTime(50)

        expect(wrapper.emitted('load')).toHaveLength(1)
      })

      test('type Number has effect', () => {
        const { target, wrapper } = mountInfiniteScroll({ debounce: 0 })

        target.scrollTop = 450
        target.dispatchEvent(new Event('scroll'))

        expect(wrapper.emitted('load')).toHaveLength(1)
      })
    })

    describe('[(prop)initial-index]', () => {
      test('type Number has effect', () => {
        const { wrapper } = mountInfiniteScroll({ initialIndex: 4 })

        wrapper.vm.trigger()

        expect(wrapper.emitted('load')[0][0]).toBe(5)
      })
    })

    describe('[(prop)scroll-target]', () => {
      test('type Element has effect', () => {
        const target = createScrollTarget()
        const addEventListener = vi.spyOn(target, 'addEventListener')

        mountInfiniteScroll({}, {}, target)

        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })

      test('type String has effect', () => {
        const target = createScrollTarget('infinite-scroll-target')
        const addEventListener = vi.spyOn(target, 'addEventListener')
        const wrapper = mount(QInfiniteScroll, {
          props: {
            debounce: 0,
            scrollTarget: '#infinite-scroll-target'
          },
          attachTo: document.body
        })
        wrappers.push(wrapper)

        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountInfiniteScroll({ disable: true })

        wrapper.vm.trigger()

        expect(wrapper.emitted()).not.toHaveProperty('load')
        expect(wrapper.find('.q-infinite-scroll__loading').exists()).toBe(false)
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', () => {
        const { target, wrapper } = mountInfiniteScroll(
          { reverse: true },
          {
            default: () => 'Content',
            loading: () => 'Loading'
          }
        )

        target.scrollTop = 100
        wrapper.vm.poll()

        expect(wrapper.emitted('load')).toHaveLength(1)
        expect(wrapper.text()).toBe('LoadingContent')
      })

      test('opts out of browser scroll anchoring while loading', async () => {
        const { target, wrapper } = mountInfiniteScroll({ reverse: true })

        target.scrollTop = 100
        wrapper.vm.poll()
        await nextTick()

        // the component compensates for the prepended content itself, so the
        // browser must not also do it while the load is in flight
        expect(wrapper.classes()).toContain('q-infinite-scroll--no-anchoring')

        // the loaded batch prepends 600px worth of content
        Object.defineProperty(target, 'scrollHeight', {
          configurable: true,
          value: 1600
        })

        const [, done] = wrapper.emitted('load')[0]
        done()
        await nextTick()
        await nextTick()

        // the scroll position follows the content that got pushed down...
        expect(target.scrollTop).toBe(700)

        // ...and anchoring is handed back afterwards, so that it keeps
        // protecting the reading position against unrelated content growth
        expect(wrapper.classes()).not.toContain(
          'q-infinite-scroll--no-anchoring'
        )
      })

      test('does not opt out of scroll anchoring when not reverse', async () => {
        const target = createScrollTarget()
        target.scrollTop = 350

        const { wrapper } = mountInfiniteScroll({ offset: 550 }, {}, target)
        await nextTick()

        expect(wrapper.emitted('load')).toHaveLength(1)
        expect(wrapper.classes()).not.toContain(
          'q-infinite-scroll--no-anchoring'
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const { wrapper } = mountInfiniteScroll(
          {},
          { default: () => 'Infinite scroll content' }
        )

        expect(wrapper.text()).toContain('Infinite scroll content')
      })
    })

    describe('[(slot)loading]', () => {
      test('renders the content', () => {
        const { wrapper } = mountInfiniteScroll(
          {},
          { loading: () => 'Loading content' }
        )

        expect(wrapper.get('.q-infinite-scroll__loading').text()).toBe(
          'Loading content'
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)load]', () => {
      test('is emitting', () => {
        const { wrapper } = mountInfiniteScroll()

        wrapper.vm.trigger()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('load')
        expect(eventList.load).toHaveLength(1)

        const [index, done] = eventList.load[0]
        expect(index).toBe(1)
        expect(done).toBeTypeOf('function')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)poll]', () => {
      test('should be callable', () => {
        const { target, wrapper } = mountInfiniteScroll()
        target.scrollTop = 450

        expect(wrapper.vm.poll()).toBeUndefined()
        expect(wrapper.emitted('load')).toHaveLength(1)
      })
    })

    describe('[(method)trigger]', () => {
      test('should be callable', () => {
        const { wrapper } = mountInfiniteScroll()

        expect(wrapper.vm.trigger()).toBeUndefined()
        expect(wrapper.emitted('load')).toHaveLength(1)
      })
    })

    describe('[(method)reset]', () => {
      test('should be callable', () => {
        const { wrapper } = mountInfiniteScroll()

        wrapper.vm.setIndex(8)
        expect(wrapper.vm.reset()).toBeUndefined()
        wrapper.vm.trigger()

        expect(wrapper.emitted('load')[0][0]).toBe(1)
      })
    })

    describe('[(method)stop]', () => {
      test('should be callable', async () => {
        const { wrapper } = mountInfiniteScroll()

        expect(wrapper.vm.stop()).toBeUndefined()
        wrapper.vm.trigger()
        await nextTick()

        expect(wrapper.emitted()).not.toHaveProperty('load')
        expect(wrapper.find('.q-infinite-scroll__loading').exists()).toBe(false)
      })
    })

    describe('[(method)resume]', () => {
      test('should be callable', () => {
        const { target, wrapper } = mountInfiniteScroll()
        wrapper.vm.stop()
        target.scrollTop = 450

        expect(wrapper.vm.resume()).toBeUndefined()
        expect(wrapper.emitted('load')).toHaveLength(1)
      })
    })

    describe('[(method)setIndex]', () => {
      test('should be callable', () => {
        const { wrapper } = mountInfiniteScroll()

        expect(wrapper.vm.setIndex(10)).toBeUndefined()
        wrapper.vm.trigger()

        expect(wrapper.emitted('load')[0][0]).toBe(11)
      })
    })

    describe('[(method)updateScrollTarget]', () => {
      test('should be callable', () => {
        const target = createScrollTarget()
        const addEventListener = vi.spyOn(target, 'addEventListener')
        const { wrapper } = mountInfiniteScroll({}, {}, target)
        addEventListener.mockClear()

        expect(wrapper.vm.updateScrollTarget()).toBeUndefined()
        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })
    })
  })
})
