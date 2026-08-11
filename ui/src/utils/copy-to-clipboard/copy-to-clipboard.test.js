import { afterEach, describe, expect, test, vi } from 'vitest'

import copyToClipboard from './copy-to-clipboard.js'

// The test iframe is not granted the clipboard-write permission, so a real
// navigator.clipboard.writeText() call always rejects with a NotAllowedError;
// the outcome therefore has to be simulated on the real Clipboard object.
function mockClipboardWrite(implementation) {
  return vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockImplementation(implementation)
}

// The browser always exposes the async Clipboard API, so the
// execCommand("copy") fallback branch can only be reached by hiding it.
function hideClipboardApi() {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    writable: true,
    value: void 0
  })
}

afterEach(() => {
  // drop the own property (if any), resurfacing the native accessor
  delete navigator.clipboard

  vi.restoreAllMocks()
})

describe('[copyToClipboard API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('uses the Clipboard API when available', async () => {
        const writeText = mockClipboardWrite(() => Promise.resolve())

        await expect(copyToClipboard('some text')).resolves.toBeUndefined()

        expect(writeText).toHaveBeenCalledTimes(1)
        expect(writeText).toHaveBeenCalledWith('some text')
      })

      test('forwards a Clipboard API rejection', async () => {
        const err = new Error('denied')
        mockClipboardWrite(() => Promise.reject(err))

        await expect(copyToClipboard('some text')).rejects.toBe(err)
      })

      test('falls back to execCommand("copy") and resolves on success', async () => {
        hideClipboardApi()

        // a successful execCommand('copy') needs user activation, which an
        // automated run does not have, so success has to be simulated
        let selectedValue
        const execCommand = vi
          .spyOn(document, 'execCommand')
          .mockImplementation(cmd => {
            // capture the state of the DOM while the temporary node still exists
            const area = document.querySelector('textarea')
            selectedValue = area?.value
            return cmd === 'copy'
          })

        await expect(copyToClipboard('some text')).resolves.toBe(true)

        expect(execCommand).toHaveBeenCalledTimes(1)
        expect(execCommand).toHaveBeenCalledWith('copy')
        expect(selectedValue).toBe('some text')
      })

      test('removes the temporary node used by the fallback', async () => {
        hideClipboardApi()
        vi.spyOn(document, 'execCommand').mockImplementation(() => true)

        await copyToClipboard('some text')

        expect(document.querySelector('textarea')).toBeNull()
      })

      test('rejects when the fallback fails to copy', async () => {
        hideClipboardApi()

        // without user activation the real execCommand('copy')
        // refuses to copy and returns false
        const execCommand = vi.spyOn(document, 'execCommand')

        await expect(copyToClipboard('some text')).rejects.toBe(false)

        expect(execCommand).toHaveBeenCalledExactlyOnceWith('copy')
        expect(document.querySelector('textarea')).toBeNull()
      })
    })
  })
})
