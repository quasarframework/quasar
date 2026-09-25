import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import useDropZone from './use-drop-zone.js'
import { client } from '../../plugins/platform/Platform.js'

enableAutoUnmount(afterEach)

const originalSafari = client.is.safari

afterEach(() => {
  client.is.safari = originalSafari
  vi.restoreAllMocks()
})

function createFile(name, type, size) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 })
}

function createTransfer(files = []) {
  const transfer = new DataTransfer()
  files.forEach(file => {
    transfer.items.add(file)
  })
  return transfer
}

function drag(el, type, init = {}) {
  const evt = new DragEvent(type, {
    bubbles: true,
    cancelable: true,
    dataTransfer: createTransfer(),
    ...init
  })
  el.dispatchEvent(evt)
  return evt
}

function drop(el, files) {
  return drag(el, 'drop', { dataTransfer: createTransfer(files) })
}

const box = 'width: 120px; height: 80px'

// mounts a component whose root is the drop zone, with one child inside
function mountZone(options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useDropZone(options)
        return () => h('div', { style: box }, [h('span', 'child')])
      }
    })
  )

  return {
    wrapper,
    el: wrapper.element,
    child: wrapper.element.firstElementChild,
    ...result
  }
}

describe('[useDropZone API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const {
          isOverDropZone,
          droppedFiles,
          rejectedFiles,
          resetDropZone,
          stop
        } = mountZone()

        expect(isOverDropZone).$ref(false)
        expect(droppedFiles).$ref([])
        expect(rejectedFiles).$ref([])
        expect(resetDropZone).toBeTypeOf('function')
        expect(stop).toBeTypeOf('function')
      })

      test('tracks a drag over the component root', () => {
        const onEnter = vi.fn()
        const onLeave = vi.fn()
        const { el, isOverDropZone } = mountZone({ onEnter, onLeave })

        const enter = drag(el, 'dragenter')
        expect(enter.defaultPrevented).toBe(true)
        expect(isOverDropZone.value).toBe(true)
        expect(onEnter).toHaveBeenCalledExactlyOnceWith(enter)

        // Chromium ignores the dropEffect setter on a synthetic DataTransfer,
        // so the call itself is what can be observed
        const dropEffect = vi.spyOn(DataTransfer.prototype, 'dropEffect', 'set')
        const over = drag(el, 'dragover')
        expect(over.defaultPrevented).toBe(true)
        expect(dropEffect).toHaveBeenCalledExactlyOnceWith('copy')
        expect(isOverDropZone.value).toBe(true)
        expect(onEnter).toHaveBeenCalledTimes(1)
        expect(onLeave).not.toHaveBeenCalled()

        const leave = drag(el, 'dragleave', { relatedTarget: document.body })
        expect(leave.defaultPrevented).toBe(true)
        expect(isOverDropZone.value).toBe(false)
        expect(onLeave).toHaveBeenCalledExactlyOnceWith(leave)

        // a drag leaving the window has no related target either
        drag(el, 'dragenter')
        expect(isOverDropZone.value).toBe(true)
        drag(el, 'dragleave', { relatedTarget: null })
        expect(isOverDropZone.value).toBe(false)
        expect(onEnter).toHaveBeenCalledTimes(2)
        expect(onLeave).toHaveBeenCalledTimes(2)
      })

      test('stays over the zone while moving between its children', () => {
        const onLeave = vi.fn()
        const { el, child, isOverDropZone } = mountZone({ onLeave })

        drag(el, 'dragenter')
        // entering the child: dragenter on it, then dragleave on the zone
        drag(child, 'dragenter')
        drag(el, 'dragleave', { relatedTarget: child })
        expect(isOverDropZone.value).toBe(true)

        // and back to the zone itself
        drag(el, 'dragenter')
        drag(child, 'dragleave', { relatedTarget: el })
        expect(isOverDropZone.value).toBe(true)
        expect(onLeave).not.toHaveBeenCalled()

        drag(el, 'dragleave', { relatedTarget: document.body })
        expect(isOverDropZone.value).toBe(false)
        expect(onLeave).toHaveBeenCalledTimes(1)
      })

      test('asks what lies under the pointer on Safari', () => {
        client.is.safari = true
        const { el, isOverDropZone } = mountZone()
        const rect = el.getBoundingClientRect()
        const inside = {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2
        }
        const outside = { clientX: rect.right + 50, clientY: rect.bottom + 50 }
        const spy = vi.spyOn(document, 'elementsFromPoint')

        drag(el, 'dragenter')
        drag(el, 'dragleave', { relatedTarget: null, ...inside })
        expect(isOverDropZone.value).toBe(true)
        expect(spy).toHaveBeenCalledTimes(1)

        drag(el, 'dragleave', { relatedTarget: null, ...outside })
        expect(isOverDropZone.value).toBe(false)
        expect(spy).toHaveBeenCalledTimes(2)

        // a related target is trusted when Safari does report one
        drag(el, 'dragenter')
        drag(el, 'dragleave', { relatedTarget: document.body, ...inside })
        expect(isOverDropZone.value).toBe(false)
        expect(spy).toHaveBeenCalledTimes(2)
      })

      test('validates the dropped files and reports through refs and callbacks', () => {
        const onDrop = vi.fn()
        const onRejected = vi.fn()
        const onLeave = vi.fn()
        const { el, isOverDropZone, droppedFiles, rejectedFiles } = mountZone({
          multiple: true,
          accept: 'image/*',
          maxFileSize: 8,
          onDrop,
          onRejected,
          onLeave
        })

        const image = createFile('a.png', 'image/png', 4)
        const big = createFile('b.png', 'image/png', 16)
        const text = createFile('c.txt', 'text/plain', 4)

        drag(el, 'dragenter')
        const evt = drop(el, [image, big, text])

        expect(evt.defaultPrevented).toBe(true)
        expect(isOverDropZone.value).toBe(false)
        expect(onLeave).toHaveBeenCalledExactlyOnceWith(evt)
        expect(droppedFiles.value).toStrictEqual([image])
        expect(rejectedFiles.value).toStrictEqual([
          { failedPropValidation: 'accept', file: text },
          { failedPropValidation: 'max-file-size', file: big }
        ])
        expect(onDrop).toHaveBeenCalledExactlyOnceWith([image], evt)
        expect(onRejected).toHaveBeenCalledExactlyOnceWith(rejectedFiles.value)

        // a drop where nothing passes keeps the previous accepted files
        // but still reports through onDrop, with the Event
        const evt2 = drop(el, [text])
        expect(droppedFiles.value).toStrictEqual([image])
        expect(rejectedFiles.value).toStrictEqual([
          { failedPropValidation: 'accept', file: text }
        ])
        expect(onDrop).toHaveBeenLastCalledWith([], evt2)
        expect(onRejected).toHaveBeenCalledTimes(2)

        // a drop carrying no files at all
        const evt3 = drop(el, [])
        expect(rejectedFiles.value).toStrictEqual([])
        expect(onDrop).toHaveBeenLastCalledWith([], evt3)
        expect(onRejected).toHaveBeenCalledTimes(2)
      })

      test('keeps the first file only unless multiple is set', () => {
        const options = ref({})
        const { el, droppedFiles } = mountZone(options)
        const files = [
          createFile('a.txt', 'text/plain', 1),
          createFile('b.txt', 'text/plain', 1)
        ]

        drop(el, files)
        expect(droppedFiles.value).toStrictEqual([files[0]])

        // the options are read at drop time
        options.value = { multiple: true }
        drop(el, files)
        expect(droppedFiles.value).toStrictEqual(files)
      })

      test('does not let a drop reach an enclosing zone', () => {
        const outer = vi.fn()
        const inner = vi.fn()
        let innerEl

        mount(
          defineComponent({
            setup() {
              const target = ref(null)
              useDropZone({ onDrop: outer })
              useDropZone({ target, onDrop: inner })
              return () => h('div', [h('div', { ref: target })])
            },
            mounted() {
              innerEl = this.$el.firstElementChild
            }
          })
        )

        drop(innerEl, [createFile('a.txt', 'text/plain', 1)])
        expect(inner).toHaveBeenCalledTimes(1)
        expect(outer).not.toHaveBeenCalled()
      })

      test('resets the file lists', () => {
        const { el, droppedFiles, rejectedFiles, resetDropZone } = mountZone({
          accept: '.txt'
        })

        drop(el, [createFile('a.txt', 'text/plain', 1)])
        drop(el, [createFile('b.png', 'image/png', 1)])
        expect(droppedFiles.value).toHaveLength(1)
        expect(rejectedFiles.value).toHaveLength(1)

        resetDropZone()
        expect(droppedFiles.value).toStrictEqual([])
        expect(rejectedFiles.value).toStrictEqual([])
      })

      test('listens on the target instead of the root when given', () => {
        let result, zone
        const wrapper = mount(
          defineComponent({
            setup() {
              const target = ref(null)
              result = useDropZone({ target })
              return () => h('div', [h('div', { ref: target })])
            },
            mounted() {
              zone = this.$el.firstElementChild
            }
          })
        )

        drag(wrapper.element, 'dragenter')
        expect(result.isOverDropZone.value).toBe(false)

        drag(zone, 'dragenter')
        expect(result.isOverDropZone.value).toBe(true)
      })

      test('accepts a component instance as target', () => {
        const Child = defineComponent({
          setup() {
            return () => h('div', { style: box })
          }
        })

        let result
        const wrapper = mount(
          defineComponent({
            setup() {
              const target = ref(null)
              result = useDropZone({ target })
              return () => h('div', [h(Child, { ref: target })])
            }
          })
        )

        drag(wrapper.findComponent(Child).element, 'dragenter')
        expect(result.isOverDropZone.value).toBe(true)
      })

      test('follows reactive options', async () => {
        const disabled = ref(false)
        const { el, isOverDropZone } = mountZone(() => ({
          disabled: disabled.value
        }))

        drag(el, 'dragenter')
        expect(isOverDropZone.value).toBe(true)

        // disabling mid-drag releases the zone and hands the browser its
        // default back
        disabled.value = true
        await nextTick()
        expect(isOverDropZone.value).toBe(false)
        expect(drag(el, 'dragenter').defaultPrevented).toBe(false)
        expect(isOverDropZone.value).toBe(false)

        disabled.value = false
        await nextTick()
        expect(drag(el, 'dragenter').defaultPrevented).toBe(true)
        expect(isOverDropZone.value).toBe(true)
      })

      test('follows a changing target', async () => {
        const first = document.createElement('div')
        const second = document.createElement('div')
        const target = ref(first)
        const { isOverDropZone } = mountZone({ target })

        drag(first, 'dragenter')
        expect(isOverDropZone.value).toBe(true)

        target.value = second
        await nextTick()
        expect(isOverDropZone.value).toBe(false)
        expect(drag(first, 'dragenter').defaultPrevented).toBe(false)
        expect(isOverDropZone.value).toBe(false)

        drag(second, 'dragenter')
        expect(isOverDropZone.value).toBe(true)
      })

      test('stops on demand until the target changes', async () => {
        const first = document.createElement('div')
        const second = document.createElement('div')
        const target = ref(first)
        const accept = ref('.txt')
        const { isOverDropZone, stop } = mountZone(() => ({
          target: target.value,
          accept: accept.value
        }))

        drag(first, 'dragenter')
        expect(isOverDropZone.value).toBe(true)

        stop()
        expect(isOverDropZone.value).toBe(false)
        expect(drag(first, 'dragenter').defaultPrevented).toBe(false)

        // another option changing does not re-arm the released zone
        accept.value = '.csv'
        await nextTick()
        expect(drag(first, 'dragenter').defaultPrevented).toBe(false)
        expect(isOverDropZone.value).toBe(false)

        // another target does
        target.value = second
        await nextTick()
        expect(drag(second, 'dragenter').defaultPrevented).toBe(true)
        expect(isOverDropZone.value).toBe(true)

        // and the released element can serve again after that
        target.value = first
        await nextTick()
        expect(drag(first, 'dragenter').defaultPrevented).toBe(true)
        expect(isOverDropZone.value).toBe(true)
      })

      test('stops on unmount', () => {
        const { wrapper, el, isOverDropZone } = mountZone()

        drag(el, 'dragenter')
        expect(isOverDropZone.value).toBe(true)

        wrapper.unmount()
        expect(isOverDropZone.value).toBe(false)
        expect(drag(el, 'dragenter').defaultPrevented).toBe(false)
      })

      test('works outside of a component', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const el = document.createElement('div')
        const onDrop = vi.fn()
        const file = createFile('a.txt', 'text/plain', 1)

        const { isOverDropZone, droppedFiles, stop } = useDropZone({
          target: el,
          onDrop
        })

        drag(el, 'dragenter')
        expect(isOverDropZone.value).toBe(true)

        drop(el, [file])
        expect(droppedFiles.value).toStrictEqual([file])
        expect(onDrop).toHaveBeenCalledTimes(1)

        stop()
        expect(drag(el, 'dragenter').defaultPrevented).toBe(false)
        expect(warn).not.toHaveBeenCalled()
      })
    })
  })
})
