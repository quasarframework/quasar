import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import QInfiniteScroll from './QInfiniteScroll.js'
import preventScroll from '../../utils/scroll/prevent-scroll.js'

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

  // a real 100px tall scroll container holding 1000px worth of content
  target.style.cssText = 'height: 100px; width: 100px; overflow: auto;'

  const content = document.createElement('div')
  content.style.height = '1000px'
  target.append(content)

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
        target.firstChild.style.height = '1600px'

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

  describe('[Generic]', () => {
    test('does not poll while an overlay scroll-locks the page', async () => {
      // give the page real overflowing content, so window scrolling works
      const filler = document.createElement('div')
      filler.style.height = '3000px'
      document.body.append(filler)
      targets.push(filler)

      const wrapper = mount(QInfiniteScroll, {
        props: { debounce: 0, reverse: true },
        attachTo: document.body
      })
      wrappers.push(wrapper)

      try {
        // mounting in reverse mode scrolls the page to the bottom,
        // far beyond the trigger offset, so nothing loads yet
        expect(window.scrollY).toBeGreaterThan(500)
        expect(wrapper.emitted()).not.toHaveProperty('load')

        // a Dialog or an overlay Drawer opens...
        preventScroll(true)

        // ...pinning the window scroll position at 0, which reverse mode
        // would misread as "scrolled to the top" and load over and over
        await expect.poll(() => window.scrollY).toBe(0)
        window.dispatchEvent(new Event('scroll'))

        expect(wrapper.emitted()).not.toHaveProperty('load')

        // closing the overlay restores the scroll position and polling
        preventScroll(false)
        await expect.poll(() => window.scrollY).toBeGreaterThan(500)

        window.scrollTo(0, 100)
        window.dispatchEvent(new Event('scroll'))

        expect(wrapper.emitted('load')).toHaveLength(1)
      } finally {
        // the module keeps an internal counter, so always end up
        // unregistered even when an assertion above fails
        preventScroll(false)
        window.scrollTo(0, 0)
      }
    })

    test('resumes polling when a lock engaged with the page at the top releases', () => {
      // the page sits at position 0 with no scrollbar, so once the lock
      // releases no scroll event can ever fire; the component has to come
      // back through the prevent-scroll release listeners instead (#18520)
      preventScroll(true)

      try {
        // mounting while the lock is held: the mount-time poll is skipped
        const wrapper = mount(QInfiniteScroll, {
          props: { debounce: 0 },
          attachTo: document.body
        })
        wrappers.push(wrapper)

        expect(wrapper.emitted()).not.toHaveProperty('load')

        // releasing the lock alone must bring the first load;
        // deliberately no scroll event gets dispatched here
        preventScroll(false)

        expect(wrapper.emitted('load')).toHaveLength(1)
      } finally {
        preventScroll(false)
      }
    })

    test('recovers a poll skipped because disable was released under the lock', async () => {
      const wrapper = mount(QInfiniteScroll, {
        props: { debounce: 0, disable: true },
        attachTo: document.body
      })
      wrappers.push(wrapper)

      preventScroll(true)

      try {
        await wrapper.setProps({ disable: false })

        // the resume happened while the lock was held, so it polled nothing
        expect(wrapper.emitted()).not.toHaveProperty('load')

        preventScroll(false)

        expect(wrapper.emitted('load')).toHaveLength(1)
      } finally {
        preventScroll(false)
      }
    })

    test('keeps polling element scroll targets while the page is scroll-locked', () => {
      preventScroll(true)

      try {
        const { target, wrapper } = mountInfiniteScroll()

        target.scrollTop = 450
        target.dispatchEvent(new Event('scroll'))

        expect(wrapper.emitted('load')).toHaveLength(1)
      } finally {
        preventScroll(false)
      }
    })

    test('stops polling for good once a load reports being done', async () => {
      const { target, wrapper } = mountInfiniteScroll()

      target.scrollTop = 450
      target.dispatchEvent(new Event('scroll'))

      const [, done] = wrapper.emitted('load')[0]
      done(true)
      // the stop happens in a nextTick callback and the loading slot
      // needs the re-render that follows it
      await nextTick()
      await nextTick()

      target.scrollTop = 500
      target.dispatchEvent(new Event('scroll'))

      expect(wrapper.emitted('load')).toHaveLength(1)
      expect(wrapper.find('.q-infinite-scroll__loading').exists()).toBe(false)
    })
  })
})
