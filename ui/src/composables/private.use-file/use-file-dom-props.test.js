import { afterEach, describe, expect, test, vi } from 'vitest'
import { reactive } from 'vue'

import useFileDomProps from './use-file-dom-props.js'

const dataTransferDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'DataTransfer'
)
const clipboardEventDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'ClipboardEvent'
)

afterEach(() => {
  vi.unstubAllGlobals()

  if (dataTransferDescriptor === void 0) {
    Reflect.deleteProperty(window, 'DataTransfer')
  } else {
    Object.defineProperty(window, 'DataTransfer', dataTransferDescriptor)
  }

  if (clipboardEventDescriptor === void 0) {
    Reflect.deleteProperty(window, 'ClipboardEvent')
  } else {
    Object.defineProperty(window, 'ClipboardEvent', clipboardEventDescriptor)
  }
})

function installDataTransferMock() {
  vi.stubGlobal(
    'DataTransfer',
    class {
      constructor() {
        this.files = []
        this.items = {
          add: file => {
            this.files.push(file)
          }
        }
      }
    }
  )
}

describe('[useFileDomProps API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        installDataTransferMock()

        const file = new File(['content'], 'example.txt')
        const result = useFileDomProps({ modelValue: file })

        expect(result).$ref({ files: [file] })
      })

      test('adds every file from an array-like model', () => {
        installDataTransferMock()

        const files = [
          new File(['first'], 'first.txt'),
          new File(['second'], 'second.txt')
        ]
        const result = useFileDomProps({ modelValue: files })

        expect(result.value.files).toStrictEqual(files)
      })

      test('uses the ClipboardEvent fallback when DataTransfer is unavailable', () => {
        Reflect.deleteProperty(window, 'DataTransfer')

        vi.stubGlobal(
          'ClipboardEvent',
          class {
            constructor() {
              this.clipboardData = {
                files: [],
                items: {
                  add: file => {
                    this.clipboardData.files.push(file)
                  }
                }
              }
            }
          }
        )

        const file = new File(['content'], 'example.txt')
        const result = useFileDomProps({ modelValue: file })

        expect(result).$ref({ files: [file] })
      })

      test('returns an undefined files value when browser file-transfer APIs are unavailable', () => {
        Reflect.deleteProperty(window, 'DataTransfer')
        Reflect.deleteProperty(window, 'ClipboardEvent')

        const result = useFileDomProps({
          modelValue: new File(['content'], 'example.txt')
        })

        expect(result).$ref({ files: void 0 })
      })

      test('only supplies files for file inputs when guarded', () => {
        installDataTransferMock()

        const file = new File(['content'], 'example.txt')
        const props = reactive({
          modelValue: file,
          type: 'text'
        })
        const result = useFileDomProps(props, true)

        expect(result).$ref(void 0)

        props.type = 'file'
        expect(result).$ref({ files: [file] })
      })

      test('returns an undefined files value when the browser API fails', () => {
        vi.stubGlobal(
          'DataTransfer',
          class {
            constructor() {
              throw new Error('DataTransfer is unavailable')
            }
          }
        )

        const result = useFileDomProps({
          modelValue: new File(['content'], 'example.txt')
        })

        expect(result).$ref({ files: void 0 })
      })
    })
  })
})
