import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, shallowRef } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import { createAdjustHeightFn, useAutogrow } from './use-autogrow.js'

function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

// a bare textarea driven by the composable, the way QInput drives its own
const Host = defineComponent({
  props: {
    modelValue: String,
    autogrow: Boolean,
    dense: Boolean
  },

  setup(props, { attrs, expose }) {
    const inputRef = shallowRef(null)
    const adjustHeight = createAdjustHeightFn(
      props,
      attrs,
      inputRef,
      useQuasar()
    )

    expose({ adjustHeight })

    return () =>
      h('div', [
        h('textarea', {
          ref: inputRef,
          rows: 1,
          value: props.modelValue,
          style: 'width: 200px; font: 14px/18px monospace'
        })
      ])
  }
})

let wrapper

function mountHost(props = {}, attrs = {}) {
  wrapper = mount(Host, {
    props: { modelValue: 'line1', autogrow: true, ...props },
    attrs
  })
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

describe('[useAutogrow API]', () => {
  describe('[Functions]', () => {
    describe('[(function)createAdjustHeightFn]', () => {
      test('sizes the textarea on mount and grows it on demand', async () => {
        mountHost()
        const inp = wrapper.get('textarea').element

        await nextFrame()

        const oneLine = inp.offsetHeight
        expect(inp.style.height).toBe(`${oneLine}px`)
        expect(inp.style.overflowY).toBe('hidden')

        await wrapper.setProps({ modelValue: 'line1\nline2\nline3' })
        wrapper.vm.adjustHeight()
        await nextFrame()

        expect(inp.offsetHeight).toBeGreaterThan(oneLine)
        expect(inp.style.height).toBe(`${inp.offsetHeight}px`)
      })

      test('restores the inline styles when autogrow turns off', async () => {
        mountHost()
        const inp = wrapper.get('textarea').element

        await nextFrame()
        await wrapper.setProps({ autogrow: false })

        expect(inp.style.height).toBe('')
        expect(inp.style.overflowY).toBe('')
      })

      test('hands the height back to a rows attribute when autogrow turns off', async () => {
        mountHost({}, { rows: 3 })
        const inp = wrapper.get('textarea').element

        await nextFrame()
        await wrapper.setProps({ autogrow: false })

        expect(inp.style.height).toBe('auto')
      })

      test('coalesces the measurements requested within one frame', async () => {
        mountHost()
        const inp = wrapper.get('textarea').element

        await nextFrame()

        const raf = vi.spyOn(window, 'requestAnimationFrame')

        await wrapper.setProps({ modelValue: 'line1\nline2\nline3' })
        wrapper.vm.adjustHeight()
        wrapper.vm.adjustHeight()
        await nextFrame()

        expect(raf).toHaveBeenCalledTimes(2) // the measurement + nextFrame()
        expect(inp.style.height).toBe(`${inp.offsetHeight}px`)
      })

      test('drops a pending measurement when autogrow turns off', async () => {
        mountHost()
        const inp = wrapper.get('textarea').element

        await nextFrame()
        wrapper.vm.adjustHeight()
        await wrapper.setProps({ autogrow: false })
        await nextFrame()

        expect(inp.style.height).toBe('')
      })

      test('drops a pending measurement on unmount', async () => {
        mountHost()
        const cancel = vi.spyOn(window, 'cancelAnimationFrame')

        await nextFrame()
        wrapper.vm.adjustHeight()
        wrapper.unmount()

        expect(cancel).toHaveBeenCalledTimes(1)
      })

      test('remeasures when autogrow turns on or dense changes', async () => {
        mountHost({ autogrow: false })
        const raf = vi.spyOn(window, 'requestAnimationFrame')

        // the watchers schedule the measurement on nextTick, which lands
        // after setProps() resolves; flush it before counting the frame
        await wrapper.setProps({ autogrow: true })
        await flushPromises()
        await nextFrame()
        expect(raf).toHaveBeenCalledTimes(2) // the measurement + nextFrame()

        await wrapper.setProps({ dense: true })
        await flushPromises()
        await nextFrame()
        expect(raf).toHaveBeenCalledTimes(4)
      })
    })
  })

  describe('[Variables]', () => {
    describe('[(variable)useAutogrow]', () => {
      test('is defined correctly', () => {
        // the tests run in a real Chromium, which implements field-sizing,
        // so the sizing is left to CSS and there is no routine to hand out
        expect(CSS.supports('field-sizing', 'content')).toBe(true)
        expect(useAutogrow).toBeUndefined()
      })
    })
  })
})
