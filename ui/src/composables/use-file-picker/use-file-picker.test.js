import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import useFilePicker from './use-file-picker.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.restoreAllMocks()
})

function createFile(name, type, size) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 })
}

// headless Chromium cannot show a native dialog, so the composable's
// input is captured through its click() and driven by hand
function captureInput() {
  const captured = { input: null }

  vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(
    function capture() {
      captured.input = this
    }
  )

  return captured
}

function select(input, files) {
  const transfer = new DataTransfer()
  files.forEach(file => {
    transfer.items.add(file)
  })
  input.files = transfer.files
  input.dispatchEvent(new Event('change'))
}

function cancel(input) {
  input.dispatchEvent(new Event('cancel'))
}

function mountPicker(options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useFilePicker(options)
        return () => h('div')
      }
    })
  )

  return { wrapper, ...result }
}

describe('[useFilePicker API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const {
          acceptedPickerFiles,
          rejectedPickerFiles,
          openFilePicker,
          resetFilePicker
        } = mountPicker()

        expect(acceptedPickerFiles).$ref([])
        expect(rejectedPickerFiles).$ref([])
        expect(openFilePicker).toBeTypeOf('function')
        expect(resetFilePicker).toBeTypeOf('function')
      })

      test('opens a file input configured from the options', () => {
        const captured = captureInput()
        const { openFilePicker } = mountPicker({
          multiple: true,
          accept: 'image/*',
          capture: 'user'
        })

        openFilePicker()

        const { input } = captured
        expect(input).toBeInstanceOf(HTMLInputElement)
        expect(input.type).toBe('file')
        expect(input.isConnected).toBe(false)
        expect(input.multiple).toBe(true)
        expect(input.webkitdirectory).toBe(false)
        expect(input.accept).toBe('image/*')
        expect(input.getAttribute('capture')).toBe('user')

        openFilePicker({ multiple: false, directory: true, capture: void 0 })

        expect(captured.input).toBe(input)
        expect(input.multiple).toBe(false)
        expect(input.webkitdirectory).toBe(true)
        expect(input.hasAttribute('capture')).toBe(false)
      })

      test('reads reactive options when opening', () => {
        const captured = captureInput()
        const options = ref({ accept: '.txt' })
        const { openFilePicker } = mountPicker(options)

        openFilePicker()
        expect(captured.input.accept).toBe('.txt')

        options.value = { accept: '.csv', multiple: true }
        openFilePicker()
        expect(captured.input.accept).toBe('.csv')
        expect(captured.input.multiple).toBe(true)
      })

      test('resolves with the accepted files and reports through refs and callbacks', async () => {
        const captured = captureInput()
        const onChange = vi.fn()
        const onRejected = vi.fn()
        const onCancel = vi.fn()
        const {
          acceptedPickerFiles,
          rejectedPickerFiles,
          openFilePicker,
          resetFilePicker
        } = mountPicker({
          multiple: true,
          accept: 'image/*',
          onChange,
          onRejected,
          onCancel
        })

        const image = createFile('image.png', 'image/png', 4)
        const text = createFile('notes.txt', 'text/plain', 4)

        const promise = openFilePicker()
        select(captured.input, [image, text])

        await expect(promise).resolves.toStrictEqual([image])
        expect(acceptedPickerFiles).$ref([image])
        expect(rejectedPickerFiles).$ref([
          { failedPropValidation: 'accept', file: text }
        ])
        expect(onChange).toHaveBeenCalledExactlyOnceWith([image])
        expect(onRejected).toHaveBeenCalledExactlyOnceWith([
          { failedPropValidation: 'accept', file: text }
        ])
        expect(onCancel).not.toHaveBeenCalled()
        // ready for the same file to be picked again
        expect(captured.input.files.length).toBe(0)

        resetFilePicker()
        expect(acceptedPickerFiles).$ref([])
        expect(rejectedPickerFiles).$ref([])
      })

      test('keeps the last accepted files when a selection is fully rejected', async () => {
        const captured = captureInput()
        const onChange = vi.fn()
        const { acceptedPickerFiles, rejectedPickerFiles, openFilePicker } =
          mountPicker({
            maxFileSize: 5,
            onChange
          })

        const small = createFile('small.txt', 'text/plain', 4)
        const big = createFile('big.txt', 'text/plain', 9)

        let promise = openFilePicker()
        select(captured.input, [small])
        await expect(promise).resolves.toStrictEqual([small])

        promise = openFilePicker()
        select(captured.input, [big])
        await expect(promise).resolves.toStrictEqual([])

        expect(acceptedPickerFiles).$ref([small])
        expect(rejectedPickerFiles).$ref([
          { failedPropValidation: 'max-file-size', file: big }
        ])
        expect(onChange).toHaveBeenCalledOnce()
      })

      test('uses the per-call overrides for validation', async () => {
        const captured = captureInput()
        const { openFilePicker } = mountPicker({ accept: 'image/*' })

        const image = createFile('image.png', 'image/png', 4)
        const text = createFile('notes.txt', 'text/plain', 4)

        const promise = openFilePicker({ accept: '.txt', multiple: true })
        select(captured.input, [image, text])

        await expect(promise).resolves.toStrictEqual([text])
      })

      test('keeps every file of a folder pick', async () => {
        const captured = captureInput()
        const { openFilePicker } = mountPicker({ directory: true })

        const first = createFile('a.txt', 'text/plain', 4)
        const second = createFile('b.txt', 'text/plain', 4)

        const promise = openFilePicker()
        select(captured.input, [first, second])

        await expect(promise).resolves.toStrictEqual([first, second])
      })

      test('resolves with null when the dialog is dismissed', async () => {
        const captured = captureInput()
        const onCancel = vi.fn()
        const onChange = vi.fn()
        const { acceptedPickerFiles, openFilePicker } = mountPicker({
          onCancel,
          onChange
        })

        const promise = openFilePicker()
        cancel(captured.input)

        await expect(promise).resolves.toBeNull()
        expect(onCancel).toHaveBeenCalledOnce()
        expect(onChange).not.toHaveBeenCalled()
        expect(acceptedPickerFiles).$ref([])
      })

      test('settles a superseded openFilePicker() with null', async () => {
        const captured = captureInput()
        const { openFilePicker } = mountPicker()
        const file = createFile('a.txt', 'text/plain', 4)

        const first = openFilePicker()
        const second = openFilePicker()

        await expect(first).resolves.toBeNull()

        select(captured.input, [file])
        await expect(second).resolves.toStrictEqual([file])
      })

      test('settles a pending openFilePicker() with null on unmount and detaches the input', async () => {
        const captured = captureInput()
        const onChange = vi.fn()
        const { wrapper, openFilePicker } = mountPicker({ onChange })

        const promise = openFilePicker()
        wrapper.unmount()

        await expect(promise).resolves.toBeNull()

        select(captured.input, [createFile('a.txt', 'text/plain', 4)])
        expect(onChange).not.toHaveBeenCalled()
      })

      test('works outside of a component instance', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const captured = captureInput()
        const { acceptedPickerFiles, openFilePicker } = useFilePicker({
          multiple: true
        })
        const file = createFile('a.txt', 'text/plain', 4)

        const promise = openFilePicker()
        select(captured.input, [file])

        await expect(promise).resolves.toStrictEqual([file])
        expect(acceptedPickerFiles).$ref([file])
        expect(warn).not.toHaveBeenCalled()
      })
    })
  })
})
