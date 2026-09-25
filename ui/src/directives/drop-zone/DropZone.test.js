import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef, nextTick, ref, withDirectives } from 'vue'

import DropZone from './DropZone.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.restoreAllMocks()
})

const overClass = 'q-drop-zone--over'

function createFile(name) {
  return new File([new Uint8Array(1)], name, { type: 'text/plain' })
}

function drag(el, type, { files = [], relatedTarget = null } = {}) {
  const dataTransfer = new DataTransfer()
  files.forEach(file => {
    dataTransfer.items.add(file)
  })

  const evt = new DragEvent(type, {
    bubbles: true,
    cancelable: true,
    dataTransfer,
    relatedTarget
  })
  el.dispatchEvent(evt)
  return evt
}

// mounts a div carrying the directive; `value` may be a ref (read on
// every render) so that a test can swap it in place
function mountDropZone(value, modifiers) {
  const TestComponent = defineComponent({
    render: () =>
      withDirectives(h('div', [h('span', 'child')]), [
        [DropZone, isRef(value) ? value.value : value, void 0, modifiers]
      ])
  })

  const wrapper = mount(TestComponent)
  return { wrapper, el: wrapper.element }
}

describe('[DropZone API]', () => {
  describe('[Value]', () => {
    test('as Boolean', async () => {
      const handler = vi.fn()
      const value = ref(false)
      const { el } = mountDropZone(value)
      const file = createFile('a.txt')

      expect(el.__qdropzone).toBeDefined()

      // disabled: the browser keeps its default and nothing is reported
      expect(drag(el, 'dragenter').defaultPrevented).toBe(false)
      expect(el.classList.contains(overClass)).toBe(false)
      drag(el, 'drop', { files: [file] })
      expect(handler).not.toHaveBeenCalled()

      value.value = handler
      await nextTick()

      expect(drag(el, 'dragenter').defaultPrevented).toBe(true)
      expect(el.classList.contains(overClass)).toBe(true)

      // disabling mid-drag withdraws the hover feedback too
      value.value = false
      await nextTick()

      expect(el.classList.contains(overClass)).toBe(false)
      expect(drag(el, 'dragenter').defaultPrevented).toBe(false)
      drag(el, 'drop', { files: [file] })
      expect(handler).not.toHaveBeenCalled()
    })

    test('as undefined', async () => {
      const handler = vi.fn()
      const value = ref(void 0)
      const { el } = mountDropZone(value)

      expect(drag(el, 'dragenter').defaultPrevented).toBe(false)

      value.value = handler
      await nextTick()

      expect(drag(el, 'dragenter').defaultPrevented).toBe(true)

      value.value = void 0
      await nextTick()

      expect(drag(el, 'dragenter').defaultPrevented).toBe(false)
      expect(el.classList.contains(overClass)).toBe(false)
    })

    test('as Object', async () => {
      const handler = vi.fn()
      const onRejected = vi.fn()
      const value = ref({
        handler,
        multiple: true,
        accept: '.txt',
        maxFileSize: 1,
        onRejected
      })
      const { el } = mountDropZone(value, { multiple: false })
      const text = createFile('a.txt')
      const other = createFile('b.txt')
      const image = new File([new Uint8Array(1)], 'c.png', {
        type: 'image/png'
      })
      const big = new File([new Uint8Array(2)], 'd.txt', { type: 'text/plain' })

      expect(drag(el, 'dragenter').defaultPrevented).toBe(true)
      expect(el.classList.contains(overClass)).toBe(true)

      // validated like QFile; the Object's multiple wins over the modifier
      const evt = drag(el, 'drop', { files: [text, image, other, big] })
      expect(handler).toHaveBeenCalledExactlyOnceWith([text, other], evt)
      expect(onRejected).toHaveBeenCalledExactlyOnceWith([
        { failedPropValidation: 'accept', file: image },
        { failedPropValidation: 'max-file-size', file: big }
      ])

      // the options are read at drop time
      value.value = { handler, accept: 'image/*' }
      await nextTick()

      const evt2 = drag(el, 'drop', { files: [text, image] })
      expect(handler).toHaveBeenLastCalledWith([image], evt2)
      expect(onRejected).toHaveBeenCalledTimes(1)

      // filter runs after the other checks and reports its own rejections
      value.value = {
        handler,
        multiple: true,
        filter: files => files.filter(file => file.name !== 'a.txt'),
        onRejected
      }
      await nextTick()

      const evt3 = drag(el, 'drop', { files: [text, other] })
      expect(handler).toHaveBeenLastCalledWith([other], evt3)
      expect(onRejected).toHaveBeenCalledTimes(2)
      expect(onRejected).toHaveBeenLastCalledWith([
        { failedPropValidation: 'filter', file: text }
      ])

      // activeClass replaces the default feedback class, even mid-hover
      value.value = { handler, activeClass: 'my-zone--active' }
      await nextTick()

      drag(el, 'dragenter')
      expect(el.classList.contains('my-zone--active')).toBe(true)
      expect(el.classList.contains(overClass)).toBe(false)

      value.value = { handler, activeClass: 'other--active' }
      await nextTick()
      expect(el.classList.contains('other--active')).toBe(true)
      expect(el.classList.contains('my-zone--active')).toBe(false)

      value.value = { handler }
      await nextTick()
      expect(el.classList.contains(overClass)).toBe(true)
      expect(el.classList.contains('other--active')).toBe(false)

      drag(el, 'dragleave', { relatedTarget: document.body })
      expect(el.classList.contains(overClass)).toBe(false)

      // an Object without a handler disables in place
      value.value = { accept: '.txt' }
      await nextTick()

      expect(drag(el, 'dragenter').defaultPrevented).toBe(false)
      expect(el.classList.contains(overClass)).toBe(false)
      drag(el, 'drop', { files: [text] })
      expect(handler).toHaveBeenCalledTimes(3)
    })

    test('as Function', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const handler = vi.fn()
      const value = ref(handler)
      const { el } = mountDropZone(value)
      const child = el.firstElementChild
      const files = [createFile('a.txt'), createFile('b.txt')]

      expect(drag(el, 'dragenter').defaultPrevented).toBe(true)
      expect(el.classList.contains(overClass)).toBe(true)

      // moving over a child is not a leave
      drag(el, 'dragleave', { relatedTarget: child })
      expect(el.classList.contains(overClass)).toBe(true)

      drag(el, 'dragleave', { relatedTarget: document.body })
      expect(el.classList.contains(overClass)).toBe(false)

      drag(el, 'dragenter')
      const evt = drag(el, 'drop', { files })

      expect(evt.defaultPrevented).toBe(true)
      expect(el.classList.contains(overClass)).toBe(false)
      // the first file only, without the multiple modifier
      expect(handler).toHaveBeenCalledExactlyOnceWith([files[0]], evt)

      // a handler swap keeps the zone attached
      const other = vi.fn()
      value.value = other
      await nextTick()

      const evt2 = drag(el, 'drop', { files })
      expect(other).toHaveBeenCalledExactlyOnceWith([files[0]], evt2)
      expect(handler).toHaveBeenCalledTimes(1)

      // no component hook was registered from the directive
      expect(warn).not.toHaveBeenCalled()
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)multiple]', () => {
      test('has effect', () => {
        const handler = vi.fn()
        const { el } = mountDropZone(handler, { multiple: true })
        const files = [createFile('a.txt'), createFile('b.txt')]

        const evt = drag(el, 'drop', { files })
        expect(handler).toHaveBeenCalledExactlyOnceWith(files, evt)
      })
    })
  })

  describe('[Generic]', () => {
    test('follows the reactive state an inline Object reads', async () => {
      const handler = vi.fn()
      const onRejected = vi.fn()
      const accept = ref('.txt')
      const multiple = ref(false)
      const activeClass = ref(void 0)
      const unrelated = ref(0)
      let renders = 0

      const wrapper = mount(
        defineComponent({
          render() {
            renders++
            // an inline literal: a fresh Object on every render
            return withDirectives(h('div', unrelated.value), [
              [
                DropZone,
                {
                  handler,
                  accept: accept.value,
                  multiple: multiple.value,
                  activeClass: activeClass.value,
                  onRejected
                }
              ]
            ])
          }
        })
      )
      const el = wrapper.element
      const text = createFile('a.txt')
      const other = createFile('b.txt')
      const image = new File([new Uint8Array(1)], 'c.png', {
        type: 'image/png'
      })

      const evt = drag(el, 'drop', { files: [text, other, image] })
      expect(handler).toHaveBeenCalledExactlyOnceWith([text], evt)
      expect(onRejected).toHaveBeenCalledExactlyOnceWith([
        { failedPropValidation: 'accept', file: image }
      ])

      // the next render carries the new options to the next drop
      accept.value = 'image/*'
      multiple.value = true
      await nextTick()
      expect(renders).toBe(2)

      const evt2 = drag(el, 'drop', { files: [text, other, image] })
      expect(handler).toHaveBeenLastCalledWith([image], evt2)
      expect(onRejected).toHaveBeenLastCalledWith([
        { failedPropValidation: 'accept', file: text },
        { failedPropValidation: 'accept', file: other }
      ])

      // a re-render for something else keeps the zone and its hover state
      drag(el, 'dragenter')
      expect(el.classList.contains(overClass)).toBe(true)

      unrelated.value++
      await nextTick()
      expect(renders).toBe(3)
      expect(el.classList.contains(overClass)).toBe(true)
      expect(drag(el, 'dragover').defaultPrevented).toBe(true)

      // the feedback class follows too, mid-hover
      activeClass.value = 'zone--active'
      await nextTick()
      expect(el.classList.contains('zone--active')).toBe(true)
      expect(el.classList.contains(overClass)).toBe(false)

      const evt3 = drag(el, 'drop', { files: [image] })
      expect(handler).toHaveBeenLastCalledWith([image], evt3)
      expect(el.classList.contains('zone--active')).toBe(false)
    })

    test('releases the element on unmount', () => {
      const handler = vi.fn()
      const { wrapper, el } = mountDropZone(handler)

      drag(el, 'dragenter')
      expect(el.classList.contains(overClass)).toBe(true)

      wrapper.unmount()

      expect(el.__qdropzone).toBeUndefined()
      expect(el.classList.contains(overClass)).toBe(false)
      expect(drag(el, 'dragenter').defaultPrevented).toBe(false)
      drag(el, 'drop', { files: [createFile('a.txt')] })
      expect(handler).not.toHaveBeenCalled()
    })
  })
})
