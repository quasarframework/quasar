import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, toValue } from 'vue'

import useIntersection from './use-intersection.js'

// observers are pooled per config, so every test must give its element
// back or the next test would silently reuse this one's observer
enableAutoUnmount(afterEach)

let observers

beforeEach(() => {
  observers = []

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback, options) {
        this.callback = callback
        this.options = options
        this.observe = vi.fn()
        this.unobserve = vi.fn()
        this.disconnect = vi.fn()
        observers.push(this)
      }
    }
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function entryFor(target, isIntersecting = true) {
  return { target, isIntersecting, rootBounds: {} }
}

function deliver(el, isIntersecting = true, observer = observers[0]) {
  observer.callback([entryFor(el, isIntersecting)], observer)
}

// mounts a component observing a child element through a template ref;
// `options` (object, ref or getter) is merged in through a getter
function mountTarget(options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        const target = ref(null)
        result = useIntersection(() => ({ target, ...toValue(options) }))
        return () => h('div', [h('span', { ref: target })])
      }
    })
  )

  return { wrapper, el: wrapper.get('span').element, ...result }
}

describe('[useIntersection API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        let result
        const wrapper = mount(
          defineComponent({
            setup() {
              result = useIntersection()
              return () => h('div')
            }
          })
        )

        // no target: the component's root element is observed
        expect(result.isIntersecting.value).toBe(false)
        expect(result.stop).toBeTypeOf('function')
        expect(observers).toHaveLength(1)
        expect(observers[0].observe).toHaveBeenCalledExactlyOnceWith(
          wrapper.element
        )
        expect(observers[0].options).toStrictEqual({
          root: null,
          rootMargin: '0px',
          threshold: 0
        })
      })

      test('does not observe a fragment root', () => {
        mount(
          defineComponent({
            setup() {
              useIntersection()
              return () => [h('div'), h('div')]
            }
          })
        )

        expect(observers).toHaveLength(0)
      })

      test('observes the target instead of the root when given', () => {
        const { el, wrapper } = mountTarget()

        expect(el).not.toBe(wrapper.element)
        expect(observers[0].observe).toHaveBeenCalledExactlyOnceWith(el)
      })

      test('accepts a plain options object', () => {
        const el = document.createElement('div')
        mount(
          defineComponent({
            setup() {
              useIntersection({ target: el, rootMargin: '3px' })
              return () => h('div')
            }
          })
        )

        expect(observers[0].observe).toHaveBeenCalledExactlyOnceWith(el)
        expect(observers[0].options.rootMargin).toBe('3px')
      })

      test('isIntersecting follows the delivered entries', () => {
        const { isIntersecting, el } = mountTarget()

        deliver(el, true)
        expect(isIntersecting.value).toBe(true)

        deliver(el, false)
        expect(isIntersecting.value).toBe(false)
      })

      test('passes the observer options through', () => {
        const root = document.createElement('div')

        mountTarget({ root, rootMargin: '10px 20px', threshold: [0, 0.5, 1] })

        expect(observers[0].options).toStrictEqual({
          root,
          rootMargin: '10px 20px',
          threshold: [0, 0.5, 1]
        })
      })

      test('calls onIntersect with every entry, false stops observing', () => {
        const onIntersect = vi.fn(entry =>
          entry.isIntersecting ? false : void 0
        )
        const { isIntersecting, el } = mountTarget({ onIntersect })
        const [observer] = observers

        deliver(el, false)
        deliver(el, true)

        expect(onIntersect).toHaveBeenCalledTimes(2)
        expect(onIntersect.mock.calls[1][0].isIntersecting).toBe(true)
        // the ref is updated before the hook sees the entry
        expect(isIntersecting.value).toBe(true)
        expect(observer.disconnect).toHaveBeenCalledOnce()

        deliver(el, false)
        expect(onIntersect).toHaveBeenCalledTimes(2)
        expect(isIntersecting.value).toBe(true)
      })

      test('once stops after the first intersecting entry and never re-arms', async () => {
        const disabled = ref(false)
        const { isIntersecting, el } = mountTarget(() => ({
          once: true,
          disabled: disabled.value
        }))
        const [observer] = observers

        deliver(el, false)
        deliver(el, true)

        expect(isIntersecting.value).toBe(true)
        expect(observer.disconnect).toHaveBeenCalledOnce()

        disabled.value = true
        await nextTick()
        disabled.value = false
        await nextTick()

        expect(observers).toHaveLength(1)
      })

      test('disabled pauses and resumes observing', async () => {
        const disabled = ref(true)
        const { el } = mountTarget(() => ({ disabled: disabled.value }))

        expect(observers).toHaveLength(0)

        disabled.value = false
        await nextTick()

        expect(observers).toHaveLength(1)
        expect(observers[0].observe).toHaveBeenCalledExactlyOnceWith(el)

        disabled.value = true
        await nextTick()

        expect(observers[0].disconnect).toHaveBeenCalledOnce()

        disabled.value = false
        await nextTick()

        expect(observers).toHaveLength(2)
        expect(observers[1].observe).toHaveBeenCalledExactlyOnceWith(el)
      })

      test('reacts to option changes without re-registering equal ones', async () => {
        const threshold = ref(0)
        const tick = ref(0)
        const { el } = mountTarget(() => ({
          threshold: threshold.value,
          // read so a re-evaluation with equal options is exercised
          rootMargin: tick.value >= 0 ? '5px' : '0px'
        }))

        tick.value++
        await nextTick()

        expect(observers).toHaveLength(1)
        expect(observers[0].observe).toHaveBeenCalledOnce()

        threshold.value = 1
        await nextTick()

        expect(observers).toHaveLength(2)
        expect(observers[0].disconnect).toHaveBeenCalledOnce()
        expect(observers[1].observe).toHaveBeenCalledExactlyOnceWith(el)
        expect(observers[1].options.threshold).toBe(1)
      })

      test('accepts the options as a ref', async () => {
        const el = document.createElement('div')
        const options = ref({ target: el, rootMargin: '1px' })
        mount(
          defineComponent({
            setup() {
              useIntersection(options)
              return () => h('div')
            }
          })
        )

        expect(observers[0].options.rootMargin).toBe('1px')

        options.value = { target: el, rootMargin: '2px' }
        await nextTick()

        expect(observers).toHaveLength(2)
        expect(observers[1].options.rootMargin).toBe('2px')
      })

      test('resolves a component target to its root element', () => {
        const Child = defineComponent({
          render: () => h('span', 'child')
        })

        const wrapper = mount(
          defineComponent({
            setup() {
              const target = ref(null)
              useIntersection({ target })
              return () => h('div', [h(Child, { ref: target })])
            }
          })
        )

        expect(observers[0].observe).toHaveBeenCalledExactlyOnceWith(
          wrapper.get('span').element
        )
      })

      test('follows the target to a new element', async () => {
        const showFirst = ref(true)

        const wrapper = mount(
          defineComponent({
            setup() {
              const target = ref(null)
              useIntersection({ target })
              return () =>
                h('div', [
                  showFirst.value
                    ? h('span', { key: 'first', ref: target })
                    : h('span', { key: 'second', ref: target })
                ])
            }
          })
        )
        const first = wrapper.get('span').element

        showFirst.value = false
        await nextTick()
        const second = wrapper.get('span').element

        expect(second).not.toBe(first)
        expect(observers).toHaveLength(2)
        expect(observers[0].disconnect).toHaveBeenCalledOnce()
        expect(observers[1].observe).toHaveBeenCalledExactlyOnceWith(second)
      })

      test('stop() releases the element and ignores later option changes', async () => {
        const disabled = ref(false)
        const { stop } = mountTarget(() => ({ disabled: disabled.value }))
        const [observer] = observers

        stop()

        expect(observer.disconnect).toHaveBeenCalledOnce()

        disabled.value = true
        await nextTick()
        disabled.value = false
        await nextTick()

        expect(observers).toHaveLength(1)
      })

      test('releases the element on unmount', () => {
        const { wrapper } = mountTarget()
        const [observer] = observers

        wrapper.unmount()

        expect(observer.disconnect).toHaveBeenCalledOnce()
      })
    })
  })

  // the stub cannot tell whether the composable drives a real observer
  // correctly, so this runs against the browser's own IntersectionObserver
  describe('[Generic]', () => {
    beforeEach(() => {
      vi.unstubAllGlobals()
    })

    test('tracks the element scrolling in and out of view', async () => {
      let state
      const wrapper = mount(
        defineComponent({
          setup() {
            const target = ref(null)
            state = useIntersection({ target })
            return () =>
              h('div', { style: 'height: 200px; overflow: auto' }, [
                h('div', { style: 'height: 400px' }),
                h('div', { ref: target, style: 'height: 20px' }),
                h('div', { style: 'height: 400px' })
              ])
          }
        }),
        { attachTo: document.body }
      )
      const area = wrapper.element

      expect(state.isIntersecting.value).toBe(false)

      area.scrollTop = 350
      await vi.waitFor(() => expect(state.isIntersecting.value).toBe(true))

      area.scrollTop = 0
      await vi.waitFor(() => expect(state.isIntersecting.value).toBe(false))
    })
  })
})
