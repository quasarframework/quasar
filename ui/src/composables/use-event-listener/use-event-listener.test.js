import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, toValue } from 'vue'

import useEventListener from './use-event-listener.js'

enableAutoUnmount(afterEach)

// mounts a component listening on a child element through a template ref
function mountTarget(event, handler, options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        const target = ref(null)
        result = useEventListener(target, event, handler, options)
        return () => h('div', [h('button', { ref: target }, 'target')])
      }
    })
  )

  return { wrapper, el: wrapper.element.firstElementChild, ...result }
}

function click(el) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

describe('[useEventListener API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        let result
        mount(
          defineComponent({
            setup() {
              result = useEventListener(window, 'resize', () => {})
              return () => h('div')
            }
          })
        )

        expect(result).toStrictEqual({ stop: expect.any(Function) })
      })

      test('listens on a template ref from mount', () => {
        const handler = vi.fn()
        const { el } = mountTarget('click', handler)

        click(el)

        expect(handler).toHaveBeenCalledOnce()
        expect(handler.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
      })

      test('listens on window and document', () => {
        const onWindow = vi.fn()
        const onDocument = vi.fn()
        mount(
          defineComponent({
            setup() {
              useEventListener(window, 'resize', onWindow)
              useEventListener(document, 'visibilitychange', onDocument)
              return () => h('div')
            }
          })
        )

        window.dispatchEvent(new Event('resize'))
        document.dispatchEvent(new Event('visibilitychange'))

        expect(onWindow).toHaveBeenCalledOnce()
        expect(onDocument).toHaveBeenCalledOnce()
      })

      test('listens on the root element of a component instance', () => {
        const handler = vi.fn()
        const Child = defineComponent({
          setup: () => () => h('button', 'child')
        })

        let childRef
        const wrapper = mount(
          defineComponent({
            setup() {
              childRef = ref(null)
              useEventListener(childRef, 'click', handler)
              return () => h('div', [h(Child, { ref: childRef })])
            }
          })
        )

        click(wrapper.element.firstElementChild)

        expect(handler).toHaveBeenCalledOnce()
      })

      test('ignores a fragment root', () => {
        const handler = vi.fn()
        const Child = defineComponent({
          setup: () => () => [h('button', 'a'), h('button', 'b')]
        })

        let childRef
        const wrapper = mount(
          defineComponent({
            setup() {
              childRef = ref(null)
              useEventListener(childRef, 'click', handler)
              return () => h('div', [h(Child, { ref: childRef })])
            }
          })
        )

        wrapper.element.querySelectorAll('button').forEach(click)

        expect(handler).not.toHaveBeenCalled()
      })

      test('works outside of a component instance', () => {
        const el = document.createElement('button')
        document.body.append(el)

        const handler = vi.fn()
        const { stop } = useEventListener(el, 'click', handler)

        click(el)
        expect(handler).toHaveBeenCalledOnce()

        stop()
        click(el)
        expect(handler).toHaveBeenCalledOnce()

        el.remove()
      })

      test('listens to an Array of events', () => {
        const handler = vi.fn()
        const { el } = mountTarget(['focus', 'blur'], handler)

        el.dispatchEvent(new FocusEvent('focus'))
        el.dispatchEvent(new FocusEvent('blur'))

        expect(handler).toHaveBeenCalledTimes(2)
        expect(handler.mock.calls[0][0].type).toBe('focus')
        expect(handler.mock.calls[1][0].type).toBe('blur')
      })

      test('follows a reactive event name', () => {
        const handler = vi.fn()
        const event = ref('focus')
        const { el } = mountTarget(event, handler)

        el.dispatchEvent(new FocusEvent('focus'))
        expect(handler).toHaveBeenCalledOnce()

        event.value = 'blur'

        el.dispatchEvent(new FocusEvent('focus'))
        expect(handler).toHaveBeenCalledOnce()

        el.dispatchEvent(new FocusEvent('blur'))
        expect(handler).toHaveBeenCalledTimes(2)
      })

      test('passes capture, passive and once to the listener', () => {
        const spy = vi.spyOn(EventTarget.prototype, 'addEventListener')
        const handler = vi.fn()
        const { el } = mountTarget('click', handler, {
          capture: true,
          passive: true,
          once: true
        })

        expect(spy).toHaveBeenCalledWith('click', handler, {
          capture: true,
          passive: true,
          once: true
        })

        click(el)
        click(el)

        expect(handler).toHaveBeenCalledOnce()
      })

      test('leaves passive unset unless given', () => {
        const spy = vi.spyOn(EventTarget.prototype, 'addEventListener')
        const handler = vi.fn()
        mountTarget('touchstart', handler, {})

        expect(spy).toHaveBeenCalledWith('touchstart', handler, {
          capture: false,
          passive: void 0,
          once: false
        })
      })

      test('removes a capture listener with the same capture flag', () => {
        const spy = vi.spyOn(EventTarget.prototype, 'removeEventListener')
        const handler = vi.fn()
        const { el, stop } = mountTarget('click', handler, { capture: true })

        stop()

        expect(spy).toHaveBeenCalledWith(
          'click',
          handler,
          expect.objectContaining({ capture: true })
        )

        click(el)
        expect(handler).not.toHaveBeenCalled()
      })

      test('pauses while disabled and resumes', () => {
        const handler = vi.fn()
        const disabled = ref(false)
        const { el } = mountTarget('click', handler, () => ({
          disabled: disabled.value
        }))

        click(el)
        expect(handler).toHaveBeenCalledOnce()

        disabled.value = true
        click(el)
        expect(handler).toHaveBeenCalledOnce()

        disabled.value = false
        click(el)
        expect(handler).toHaveBeenCalledTimes(2)
      })

      test('re-attaches when the listener options change', () => {
        const add = vi.spyOn(EventTarget.prototype, 'addEventListener')
        const remove = vi.spyOn(EventTarget.prototype, 'removeEventListener')
        const handler = vi.fn()
        const capture = ref(false)
        mountTarget('click', handler, () => ({ capture: capture.value }))

        add.mockClear()
        remove.mockClear()

        capture.value = true

        expect(remove).toHaveBeenCalledWith(
          'click',
          handler,
          expect.objectContaining({ capture: false })
        )
        expect(add).toHaveBeenCalledWith(
          'click',
          handler,
          expect.objectContaining({ capture: true })
        )
      })

      test('does not re-attach on an unrelated reactive read', () => {
        const add = vi.spyOn(EventTarget.prototype, 'addEventListener')
        const handler = vi.fn()
        const tick = ref(0)
        mountTarget('click', handler, () => {
          toValue(tick)
          return { capture: false }
        })

        add.mockClear()

        tick.value++

        expect(add).not.toHaveBeenCalled()
      })

      test('follows a target ref pointing to another element', () => {
        const handler = vi.fn()
        let target
        const wrapper = mount(
          defineComponent({
            setup() {
              target = ref(null)
              useEventListener(target, 'click', handler)
              return () =>
                h('div', [
                  h('button', { ref: target }, 'first'),
                  h('button', 'second')
                ])
            }
          })
        )
        const [first, second] = wrapper.element.children

        click(first)
        expect(handler).toHaveBeenCalledOnce()

        target.value = second

        click(first)
        expect(handler).toHaveBeenCalledOnce()

        click(second)
        expect(handler).toHaveBeenCalledTimes(2)
      })

      test('picks up a target that appears later', async () => {
        const show = ref(false)
        const handler = vi.fn()
        let target
        const wrapper = mount(
          defineComponent({
            setup() {
              target = ref(null)
              useEventListener(target, 'click', handler)
              return () =>
                h('div', [
                  show.value ? h('button', { ref: target }, 'target') : null
                ])
            }
          })
        )

        show.value = true
        await nextTick()

        click(wrapper.element.firstElementChild)

        expect(handler).toHaveBeenCalledOnce()
      })

      test('stop() ends the listening for good', () => {
        const handler = vi.fn()
        const disabled = ref(false)
        const { el, stop } = mountTarget('click', handler, () => ({
          disabled: disabled.value
        }))

        stop()

        disabled.value = true
        disabled.value = false
        click(el)

        expect(handler).not.toHaveBeenCalled()
      })

      test('stops listening on unmount', () => {
        // an element outliving the component
        const el = document.createElement('button')
        document.body.append(el)

        const handler = vi.fn()
        const wrapper = mount(
          defineComponent({
            setup() {
              useEventListener(el, 'click', handler)
              return () => h('div')
            }
          })
        )

        click(el)
        expect(handler).toHaveBeenCalledOnce()

        wrapper.unmount()

        click(el)
        expect(handler).toHaveBeenCalledOnce()

        el.remove()
      })
    })
  })
})
