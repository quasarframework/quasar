import { h, nextTick, ref } from 'vue'
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

// a real 100px tall scroll container; the component brings the content
function createScrollTarget({ id, className = 'scroll' } = {}) {
  const target = document.createElement('div')
  if (id !== void 0) target.id = id
  target.className = className
  target.style.cssText = 'height: 100px; width: 100px; overflow: auto;'

  document.body.append(target)
  targets.push(target)
  return target
}

function createFixedOverlay() {
  const overlay = document.createElement('div')
  overlay.style.cssText =
    'position: fixed; top: 0; left: 0; width: 200px; height: 200px;'
  document.body.append(overlay)
  targets.push(overlay)
  return overlay
}

function createPageFiller() {
  const filler = document.createElement('div')
  filler.style.height = '3000px'
  document.body.append(filler)
  targets.push(filler)
  return filler
}

// 1000px worth of content, so the end of it sits 900px below the
// container's visible area when scrolled to the top
function content(height = 1000) {
  return () => h('div', { style: `height: ${height}px` })
}

function mountInfiniteScroll(
  props = {},
  slots = {},
  target = createScrollTarget()
) {
  const wrapper = mount(QInfiniteScroll, {
    props: {
      debounce: 0,
      ...props
    },
    slots: {
      default: content(),
      ...slots
    },
    attachTo: target
  })

  wrappers.push(wrapper)
  return { target, wrapper }
}

function loads(wrapper) {
  return wrapper.emitted('load') ?? []
}

function loaded(wrapper, count = 1) {
  return vi.waitFor(() => {
    expect(loads(wrapper)).toHaveLength(count)
  })
}

// the observer reports after the next layout, so a report that must NOT
// come can only be ruled out by outwaiting it
function settled() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

async function notLoaded(wrapper, count = 0) {
  await settled()
  expect(loads(wrapper)).toHaveLength(count)
}

describe('[QInfiniteScroll API]', () => {
  describe('[Props]', () => {
    describe('[(prop)offset]', () => {
      test('type Number has effect', async () => {
        const { target, wrapper } = mountInfiniteScroll({ offset: 550 })

        // the end of the content is 900px below the visible area
        await notLoaded(wrapper)

        // ...and 550px below it now
        target.scrollTop = 350
        await loaded(wrapper)
      })

      test('measures from the end of the content, not of the scroll target', async () => {
        const { target, wrapper } = mountInfiniteScroll({ offset: 550 })

        // content after the component keeps the scroll target's end far away
        const footer = document.createElement('div')
        footer.style.height = '1000px'
        target.append(footer)

        target.scrollTop = 350
        await loaded(wrapper)

        // scrolled past the component, loading more is pointless
        wrapper.emitted('load')[0][1]()
        target.scrollTop = 1500
        await notLoaded(wrapper, 1)
      })
    })

    describe('[(prop)debounce]', () => {
      test('type String has effect', async () => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
        const { target, wrapper } = mountInfiniteScroll({ debounce: '50' })

        target.scrollTop = 450
        await settled()

        expect(loads(wrapper)).toHaveLength(0)

        vi.advanceTimersByTime(50)

        expect(loads(wrapper)).toHaveLength(1)
      })

      test('type Number has effect', async () => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
        const { target, wrapper } = mountInfiniteScroll({ debounce: 0 })

        target.scrollTop = 450
        await settled()

        expect(loads(wrapper)).toHaveLength(1)
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
      // the container is not detected as a scroll target (no scroll
      // class), and the end of the content sits 450px below its visible
      // area: within the offset of the container, not of the viewport
      test('type Element has effect', async () => {
        const target = createScrollTarget({ className: '' })
        const { wrapper } = mountInfiniteScroll({}, {}, target)

        target.scrollTop = 450
        await notLoaded(wrapper)

        await wrapper.setProps({ scrollTarget: target })
        await loaded(wrapper)
      })

      test('type String has effect', async () => {
        const target = createScrollTarget({
          id: 'infinite-scroll-target',
          className: ''
        })
        const { wrapper } = mountInfiniteScroll(
          { scrollTarget: '#infinite-scroll-target' },
          {},
          target
        )

        target.scrollTop = 450
        await loaded(wrapper)
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const { target, wrapper } = mountInfiniteScroll({ disable: true })

        target.scrollTop = 900
        wrapper.vm.trigger()
        await notLoaded(wrapper)

        expect(wrapper.find('.q-infinite-scroll__loading').exists()).toBe(false)
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', async () => {
        const { target, wrapper } = mountInfiniteScroll(
          { reverse: true },
          {
            default: () => [content()(), 'Content'],
            loading: () => 'Loading'
          }
        )

        // starts scrolled to the bottom, with the loading slot on top
        expect(target.scrollTop).toBe(target.scrollHeight - target.clientHeight)
        expect(wrapper.text()).toBe('LoadingContent')
        await notLoaded(wrapper)

        target.scrollTop = 100
        await loaded(wrapper)
      })

      test('opts out of browser scroll anchoring while loading', async () => {
        const contentHeight = ref(1000)
        const { target, wrapper } = mountInfiniteScroll(
          { reverse: true },
          { default: () => content(contentHeight.value)() }
        )

        target.scrollTop = 100
        await loaded(wrapper)

        // the component compensates for the prepended content itself, so the
        // browser must not also do it while the load is in flight
        expect(wrapper.classes()).toContain('q-infinite-scroll--no-anchoring')

        // the loaded batch prepends 600px worth of content
        contentHeight.value = 1600
        await nextTick()

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
        const { target, wrapper } = mountInfiniteScroll()

        target.scrollTop = 450
        await loaded(wrapper)

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
      test('should be callable', async () => {
        const { target, wrapper } = mountInfiniteScroll()
        await notLoaded(wrapper)

        // the observer reports the end of the content coming within reach
        // by itself; a poll asks it to report its current verdict again
        const observe = vi.spyOn(IntersectionObserver.prototype, 'observe')
        target.scrollTop = 450

        expect(wrapper.vm.poll()).toBeUndefined()

        expect(observe).toHaveBeenCalledExactlyOnceWith(
          wrapper.get('.q-infinite-scroll__sentinel').element
        )
        await loaded(wrapper)
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
        const { target, wrapper } = mountInfiniteScroll()

        expect(wrapper.vm.stop()).toBeUndefined()
        wrapper.vm.trigger()
        target.scrollTop = 900
        await notLoaded(wrapper)

        expect(wrapper.find('.q-infinite-scroll__loading').exists()).toBe(false)
      })
    })

    describe('[(method)resume]', () => {
      test('should be callable', async () => {
        const { target, wrapper } = mountInfiniteScroll()
        wrapper.vm.stop()
        target.scrollTop = 450
        await notLoaded(wrapper)

        expect(wrapper.vm.resume()).toBeUndefined()
        await loaded(wrapper)
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
      test('should be callable', async () => {
        // the container only becomes a scroll target later on, so the
        // offset does not apply to it until the component is told
        const target = createScrollTarget({ className: '' })
        const { wrapper } = mountInfiniteScroll({}, {}, target)

        target.scrollTop = 450
        await notLoaded(wrapper)

        target.classList.add('scroll')

        expect(wrapper.vm.updateScrollTarget()).toBeUndefined()
        await loaded(wrapper)
      })
    })
  })

  describe('[Generic]', () => {
    test('a load does not re-render the content', async () => {
      const contentRenders = vi.fn(() => h('span', 'Content'))
      const { wrapper } = mountInfiniteScroll(
        {},
        { default: contentRenders, loading: () => 'Loading...' }
      )

      const loading = wrapper.get('.q-infinite-scroll__loading')
      const renders = contentRenders.mock.calls.length

      wrapper.vm.trigger()
      await nextTick()

      expect(loading.classes()).not.toContain('invisible')

      wrapper.emitted().load[0][1]()
      await nextTick()

      expect(loading.classes()).toContain('invisible')
      expect(contentRenders).toHaveBeenCalledTimes(renders)
    })

    test('keeps loading while the content does not reach out of view', async () => {
      const contentHeight = ref(50)
      const { wrapper } = mountInfiniteScroll(
        { offset: 0 },
        { default: () => content(contentHeight.value)() }
      )

      // the content ends inside the visible area, so it loads on mount...
      await loaded(wrapper)

      // ...and again after a batch that still does not fill it
      contentHeight.value = 80
      await nextTick()
      wrapper.emitted('load')[0][1]()
      await loaded(wrapper, 2)

      // a batch reaching out of view ends it
      contentHeight.value = 200
      await nextTick()
      wrapper.emitted('load')[1][1]()
      await notLoaded(wrapper, 2)
    })

    test('the sentinel takes no room', () => {
      const { wrapper } = mountInfiniteScroll({}, { default: content(100) })

      expect(wrapper.element.getBoundingClientRect().height).toBe(100)
    })

    test('does not load while an overlay scroll-locks the page', async () => {
      // the content overflows the page by far, so window scrolling works
      const wrapper = mount(QInfiniteScroll, {
        props: { debounce: 0, reverse: true },
        slots: { default: content(3000) },
        attachTo: document.body
      })
      wrappers.push(wrapper)

      try {
        // mounting in reverse mode scrolls the page to the bottom,
        // far beyond the trigger offset, so nothing loads yet
        expect(window.scrollY).toBeGreaterThan(500)
        await notLoaded(wrapper)

        // a Dialog or an overlay Drawer opens...
        preventScroll(true)

        // ...and the page can still end up at the top while it is up (the
        // app navigating underneath); the lock may then keep the page from
        // moving, so a load has to wait for the release
        window.scrollTo(0, 0)
        await notLoaded(wrapper)

        // closing the overlay brings the load
        preventScroll(false)
        await loaded(wrapper)
      } finally {
        // the module keeps an internal counter, so always end up
        // unregistered even when an assertion above fails
        preventScroll(false)
        window.scrollTo(0, 0)
      }
    })

    test('loads once a lock engaged with the page at the top releases', async () => {
      // the page sits at position 0 with no scrollbar, so once the lock
      // releases no scroll event can ever fire; the component has to come
      // back through the prevent-scroll release listeners instead (#18520)
      preventScroll(true)

      try {
        // mounting while the lock is held: the load has to wait
        const wrapper = mount(QInfiniteScroll, {
          props: { debounce: 0 },
          slots: { default: content(50) },
          attachTo: document.body
        })
        wrappers.push(wrapper)

        await notLoaded(wrapper)

        // releasing the lock alone must bring the first load
        preventScroll(false)
        await loaded(wrapper)
      } finally {
        preventScroll(false)
      }
    })

    test('recovers a load skipped because disable was released under the lock', async () => {
      const wrapper = mount(QInfiniteScroll, {
        props: { debounce: 0, disable: true },
        slots: { default: content(50) },
        attachTo: document.body
      })
      wrappers.push(wrapper)

      preventScroll(true)

      try {
        await wrapper.setProps({ disable: false })

        // the resume happened while the lock was held, so it loaded nothing
        await notLoaded(wrapper)

        preventScroll(false)
        await loaded(wrapper)
      } finally {
        preventScroll(false)
      }
    })

    test('keeps loading from element scroll targets while the page is scroll-locked', async () => {
      preventScroll(true)

      try {
        const { target, wrapper } = mountInfiniteScroll()

        target.scrollTop = 450
        await loaded(wrapper)
      } finally {
        preventScroll(false)
      }
    })

    test('does not load a window scroll target from inside a fixed-positioned subtree', async () => {
      // the page cannot scroll content inside the overlay, so the end of
      // the content would stay within reach whatever gets loaded
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const overlay = createFixedOverlay()

      const wrapper = mount(QInfiniteScroll, {
        props: { debounce: 0 },
        slots: { default: content(50) },
        attachTo: overlay
      })
      wrappers.push(wrapper)

      await notLoaded(wrapper)

      // the placement gets called out once, so it is discoverable
      expect(warn).toHaveBeenCalledExactlyOnceWith(
        expect.stringContaining('QInfiniteScroll')
      )

      // an explicit trigger still works as the escape hatch
      wrapper.vm.trigger()
      expect(loads(wrapper)).toHaveLength(1)
    })

    test('resumes automatically when its subtree stops being fixed', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      createPageFiller()
      const overlay = createFixedOverlay()

      const wrapper = mount(QInfiniteScroll, {
        props: { debounce: 0 },
        slots: { default: content(50) },
        attachTo: overlay
      })
      wrappers.push(wrapper)

      await notLoaded(wrapper)

      // the overlay becomes part of the page flow again (after the
      // filler): the next report notices on its own, without an
      // updateScrollTarget() call
      overlay.style.position = 'static'
      await settled()

      window.scrollTo(0, document.documentElement.scrollHeight)
      try {
        await loaded(wrapper)
      } finally {
        window.scrollTo(0, 0)
      }
    })

    test('does not scroll the page when mounting in reverse inside a fixed subtree', async () => {
      // reverse mode normally jumps its scroll target to the bottom on
      // mount, but from a fixed overlay that would scroll the page behind
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      createPageFiller()
      const overlay = createFixedOverlay()

      const wrapper = mount(QInfiniteScroll, {
        props: { debounce: 0, reverse: true },
        slots: { default: content() },
        attachTo: overlay
      })
      wrappers.push(wrapper)

      expect(window.scrollY).toBe(0)
      await notLoaded(wrapper)
    })

    test('stops loading for good once a load reports being done', async () => {
      const { target, wrapper } = mountInfiniteScroll()

      target.scrollTop = 450
      await loaded(wrapper)

      const [, done] = wrapper.emitted('load')[0]
      done(true)
      // the stop happens in a nextTick callback and the loading slot
      // needs the re-render that follows it
      await nextTick()
      await nextTick()

      target.scrollTop = 900
      await notLoaded(wrapper, 1)
      expect(wrapper.find('.q-infinite-scroll__loading').exists()).toBe(false)
    })
  })
})
