import { afterEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

import useFile, { useFileEmits, useFileProps } from './use-file.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

function createFile(name, type, size, lastModified = 1) {
  return new File([new Uint8Array(size)], name, { type, lastModified })
}

function mountUseFile({
  componentProps = {},
  editable = ref(true),
  dnd = ref(false),
  getFileInput = vi.fn(),
  addFilesToQueue = vi.fn()
} = {}) {
  let api

  wrapper = mount(
    defineComponent({
      props: useFileProps,
      emits: useFileEmits,

      setup() {
        api = useFile({ editable, dnd, getFileInput, addFilesToQueue })

        return () => h('div', [api.getDndNode('file')])
      }
    }),
    { props: componentProps }
  )

  return { addFilesToQueue, api, dnd, editable, getFileInput }
}

function createDragEvent(dataTransfer = {}) {
  return {
    cancelable: true,
    dataTransfer,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn()
  }
}

describe('[useFile API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useFileProps]', () => {
      test('is defined correctly', () => {
        expect(useFileProps).$props()
      })
    })

    describe('[(variable)useFileEmits]', () => {
      test('is defined correctly', () => {
        expect(useFileEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const { api } = mountUseFile({
          componentProps: {
            maxFiles: '3',
            maxTotalSize: '2048'
          }
        })

        expect(api.maxFilesNumber).$ref(3)
        expect(api.maxTotalSizeNumber).$ref(2048)
        expect(wrapper.vm.pickFiles).toBe(api.pickFiles)
        expect(wrapper.vm.addFiles).toBe(api.addFiles)
      })

      test('opens the file picker and respects the editable state', () => {
        const input = { click: vi.fn() }
        const { addFilesToQueue, api, editable, getFileInput } = mountUseFile({
          getFileInput: vi.fn(() => input)
        })
        const files = [createFile('example.txt', 'text/plain', 4)]

        api.pickFiles()

        expect(getFileInput).toHaveBeenCalledOnce()
        expect(input.click).toHaveBeenCalledWith({ target: null })

        const event = {
          clientX: 0,
          clientY: 0,
          stopPropagation: vi.fn(),
          target: {
            matches: vi.fn(() => true)
          }
        }

        api.pickFiles(event)

        expect(event.stopPropagation).toHaveBeenCalledOnce()
        expect(input.click).toHaveBeenCalledOnce()

        api.addFiles(files)
        expect(addFilesToQueue).toHaveBeenCalledWith(null, files)

        editable.value = false
        api.pickFiles()
        api.addFiles(files)

        expect(getFileInput).toHaveBeenCalledOnce()
        expect(addFilesToQueue).toHaveBeenCalledOnce()
      })

      test('accepts matching file types and rejects non-matching files', () => {
        const { api } = mountUseFile({
          componentProps: {
            accept: 'image/*, .txt',
            multiple: true
          }
        })
        const image = createFile('image.png', 'image/png', 4)
        const text = createFile('notes.txt', 'application/octet-stream', 4)
        const pdf = createFile('document.pdf', 'application/pdf', 4)

        const result = api.processFiles(null, [image, text, pdf], [], false)

        expect(result).toStrictEqual([image, text])
        expect(image.__key).toBeTypeOf('string')
        expect(text.__key).toBeTypeOf('string')
        expect(wrapper.emitted('rejected')).toStrictEqual([
          [[{ failedPropValidation: 'accept', file: pdf }]]
        ])
      })

      test('enforces per-file and total size limits', () => {
        const { api } = mountUseFile({
          componentProps: {
            maxFileSize: '5',
            maxTotalSize: '6',
            multiple: true
          }
        })
        const accepted = createFile('accepted.txt', 'text/plain', 4)
        const tooLarge = createFile('large.txt', 'text/plain', 6)
        const overTotal = createFile('total.txt', 'text/plain', 3)

        const result = api.processFiles(
          null,
          [accepted, tooLarge, overTotal],
          [],
          false
        )

        expect(result).toStrictEqual([accepted])
        expect(wrapper.emitted('rejected')).toStrictEqual([
          [
            [
              { failedPropValidation: 'max-file-size', file: tooLarge },
              { failedPropValidation: 'max-total-size', file: overTotal }
            ]
          ]
        ])
      })

      test('filters duplicates and observes custom and maximum-file filters', () => {
        const { api } = mountUseFile({
          componentProps: {
            filter: files =>
              files.filter(file => file.name.startsWith('blocked') === false),
            maxFiles: '2',
            multiple: true
          }
        })
        const existing = createFile('existing.txt', 'text/plain', 1)
        const accepted = createFile('accepted.txt', 'text/plain', 1)
        const blocked = createFile('blocked.txt', 'text/plain', 1)
        const overLimit = createFile('over-limit.txt', 'text/plain', 1)

        expect(api.processFiles(null, [existing], [], false)).toStrictEqual([
          existing
        ])

        const result = api.processFiles(
          null,
          [existing, accepted, blocked, overLimit],
          [existing],
          true
        )

        expect(result).toStrictEqual([accepted])
        expect(wrapper.emitted('rejected')).toStrictEqual([
          [
            [
              { failedPropValidation: 'duplicate', file: existing },
              { failedPropValidation: 'filter', file: blocked },
              { failedPropValidation: 'max-files', file: overLimit }
            ]
          ]
        ])
      })

      test('normalizes an unbounded single-file selection', () => {
        const { api } = mountUseFile({
          componentProps: { accept: '*' }
        })
        const first = createFile('first.txt', 'text/plain', 1)
        const second = createFile('second.txt', 'text/plain', 1)

        const result = api.processFiles(
          { target: { files: [first, second] } },
          void 0,
          [],
          false
        )

        expect(result).toStrictEqual([first])
        expect(wrapper.emitted('rejected')).toBeUndefined()
      })

      test('handles drag enter, leave, and drop', async () => {
        const { addFilesToQueue, api, dnd } = mountUseFile()
        const dragEvent = createDragEvent({ dropEffect: 'none' })

        api.onDragover(dragEvent)

        expect(dragEvent.preventDefault).toHaveBeenCalledOnce()
        expect(dragEvent.stopPropagation).toHaveBeenCalledOnce()
        expect(dragEvent.dataTransfer.dropEffect).toBe('copy')
        expect(dnd.value).toBe(true)

        await nextTick()

        const dndElement = wrapper.find('.q-file__dnd').element
        const leaveInsideEvent = {
          ...createDragEvent(),
          relatedTarget: dndElement
        }

        api.onDragleave(leaveInsideEvent)
        expect(dnd.value).toBe(true)

        const leaveEvent = {
          ...createDragEvent(),
          relatedTarget: null
        }

        api.onDragleave(leaveEvent)
        expect(dnd.value).toBe(false)

        dnd.value = true

        const file = createFile('dropped.txt', 'text/plain', 1)
        const dropEvent = createDragEvent({ files: [file] })
        const dndNode = api.getDndNode('file')

        dndNode.props.onDrop(dropEvent)

        expect(addFilesToQueue).toHaveBeenCalledWith(null, [file])
        expect(dropEvent.dataTransfer.dropEffect).toBe('copy')
        expect(dnd.value).toBe(false)
      })
    })
  })
})
