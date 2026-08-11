import { afterEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, getCurrentInstance, h, nextTick, ref } from 'vue'

import useAnchor, {
  useAnchorProps,
  useAnchorStaticProps
} from './use-anchor.js'

let wrapper
const createdElements = []

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  createdElements.forEach(el => el.remove())
  createdElements.length = 0
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function createElement(tag = 'div') {
  const el = document.createElement(tag)
  document.body.append(el)
  createdElements.push(el)
  return el
}

function mountAnchor({
  avoidEmit = false,
  componentProps = {},
  configureAnchorEl,
  showing = ref(false)
} = {}) {
  const hide = vi.fn()
  const show = vi.fn()
  const toggle = vi.fn()
  let anchor

  wrapper = mount(
    defineComponent({
      props: {
        ...useAnchorProps,
        modelValue: Boolean
      },
      emits: ['update:modelValue'],

      setup() {
        const vm = getCurrentInstance()

        Object.assign(vm.proxy, {
          hide,
          show,
          toggle
        })

        anchor = useAnchor({
          showing,
          avoidEmit,
          configureAnchorEl
        })

        return () => h('button', { 'data-test': 'anchor-child' })
      }
    }),
    {
      props: componentProps
    }
  )

  return {
    anchor,
    anchorElement: anchor.anchorEl.value,
    hide,
    show,
    showing,
    toggle
  }
}

describe('[useAnchor API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useAnchorStaticProps]', () => {
      test('is defined correctly', () => {
        expect(useAnchorStaticProps).$props()
      })
    })

    describe('[(variable)useAnchorProps]', () => {
      test('is defined correctly', () => {
        expect(useAnchorProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('configures parent click and keyboard events', () => {
        const { anchor, anchorElement, toggle } = mountAnchor()

        expect(anchor).toStrictEqual({
          anchorEl: expect.$ref(anchorElement),
          canShow: expect.any(Function),
          anchorEvents: expect.any(Object)
        })
        expect(anchor.canShow()).toBe(true)
        expect(
          anchor.canShow({
            touches: [{}, {}]
          })
        ).toBe(false)

        const clickEvent = new MouseEvent('click')
        anchorElement.dispatchEvent(clickEvent)

        expect(toggle).toHaveBeenCalledExactlyOnceWith(clickEvent)
        expect(clickEvent.qAnchorHandled).toBe(true)

        const enterEvent = new KeyboardEvent('keyup', { keyCode: 13 })
        anchorElement.dispatchEvent(enterEvent)

        expect(toggle).toHaveBeenLastCalledWith(enterEvent)
        expect(enterEvent.qAnchorHandled).toBe(true)

        anchorElement.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }))

        expect(toggle).toHaveBeenCalledTimes(2)
      })

      test('reconfigures parent events when props change', async () => {
        const { anchorElement, hide, show, toggle } = mountAnchor()

        await wrapper.setProps({ noParentEvent: true })
        anchorElement.dispatchEvent(new MouseEvent('click'))

        expect(toggle).not.toHaveBeenCalled()

        await wrapper.setProps({
          contextMenu: true,
          noParentEvent: false
        })

        const downEvent = new MouseEvent('mousedown')
        anchorElement.dispatchEvent(downEvent)

        expect(hide).toHaveBeenCalledExactlyOnceWith(downEvent)

        const contextEvent = new MouseEvent('contextmenu', {
          cancelable: true
        })
        anchorElement.dispatchEvent(contextEvent)

        expect(contextEvent.defaultPrevented).toBe(true)
        expect(hide).toHaveBeenLastCalledWith(contextEvent)
        expect(show).not.toHaveBeenCalled()

        await nextTick()

        expect(show).toHaveBeenCalledExactlyOnceWith(contextEvent)
        expect(contextEvent.qAnchorHandled).toBe(true)
      })

      test('resolves element and selector targets', async () => {
        const firstTarget = createElement()
        firstTarget.id = 'first-anchor'
        const secondTarget = createElement()
        const { anchor } = mountAnchor({
          componentProps: { target: '#first-anchor' }
        })

        expect(anchor.anchorEl).$ref(firstTarget)

        await wrapper.setProps({ target: secondTarget })

        expect(anchor.anchorEl).$ref(secondTarget)
      })

      test('reports a missing target and repairs an open model', () => {
        const consoleError = vi
          .spyOn(console, 'error')
          .mockImplementation(() => {})
        const { anchor } = mountAnchor({
          componentProps: {
            modelValue: true,
            target: '[invalid-selector'
          }
        })

        expect(anchor.anchorEl).$ref(null)
        expect(anchor.canShow()).toBe(false)
        expect(consoleError).toHaveBeenCalledWith(
          'Anchor: target "[invalid-selector" not found'
        )
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
      })

      test('leaves model repair to callers when emission is avoided', () => {
        mountAnchor({
          avoidEmit: true,
          componentProps: {
            modelValue: true,
            target: false
          }
        })

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })

      test('supports a custom anchor configurator', async () => {
        const configureAnchorEl = vi.fn()
        const { anchor } = mountAnchor({ configureAnchorEl })

        expect(configureAnchorEl).toHaveBeenCalledExactlyOnceWith()
        expect(anchor.anchorEvents).toStrictEqual({})

        await wrapper.setProps({ contextMenu: true })

        expect(configureAnchorEl).toHaveBeenLastCalledWith(true)

        await wrapper.setProps({ noParentEvent: true })
        await wrapper.setProps({ noParentEvent: false })

        expect(configureAnchorEl).toHaveBeenCalledTimes(3)
      })

      test('opens after a sustained mobile touch', () => {
        vi.useFakeTimers()

        const { anchor, anchorElement, hide, show } = mountAnchor()
        const touchTarget = document.createElement('span')
        anchorElement.append(touchTarget)
        const touchEvent = {
          target: touchTarget,
          touches: [{}]
        }

        anchor.anchorEvents.mobileTouch(touchEvent)

        expect(hide).toHaveBeenCalledExactlyOnceWith(touchEvent)
        expect(anchorElement.classList).toContain('non-selectable')

        vi.advanceTimersByTime(299)
        expect(show).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)

        expect(show).toHaveBeenCalledExactlyOnceWith(touchEvent)
        expect(touchEvent.qAnchorHandled).toBe(true)

        anchor.anchorEvents.mobileCleanup(touchEvent)

        expect(anchorElement.classList).not.toContain('non-selectable')
      })

      test('cancels a pending mobile touch when unmounted', () => {
        vi.useFakeTimers()

        const { anchor, anchorElement, show } = mountAnchor()
        const touchTarget = document.createElement('span')
        anchorElement.append(touchTarget)

        anchor.anchorEvents.mobileTouch({
          target: touchTarget,
          touches: [{}]
        })

        wrapper.unmount()
        wrapper = void 0
        vi.advanceTimersByTime(300)

        expect(show).not.toHaveBeenCalled()
      })
    })
  })
})
