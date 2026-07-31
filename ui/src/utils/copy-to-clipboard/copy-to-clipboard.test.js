import { afterEach, describe, expect, test, vi } from 'vitest'

import copyToClipboard from './copy-to-clipboard.js'

const originalExecCommand = document.execCommand

// jsdom implements neither the async Clipboard API nor document.execCommand(),
// so both code paths need to be installed by hand.
function useClipboardApi(writeText) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    writable: true,
    value: { writeText }
  })
}

function useExecCommandFallback(execCommand) {
  // ensure the async API path is not taken
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    writable: true,
    value: void 0
  })

  document.execCommand = execCommand
}

afterEach(() => {
  delete navigator.clipboard

  if (originalExecCommand === void 0) {
    delete document.execCommand
  } else {
    document.execCommand = originalExecCommand
  }

  vi.restoreAllMocks()
})

describe('[copyToClipboard API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('uses the Clipboard API when available', async () => {
        const writeText = vi.fn(() => Promise.resolve())
        useClipboardApi(writeText)

        await expect(copyToClipboard('some text')).resolves.toBeUndefined()

        expect(writeText).toHaveBeenCalledTimes(1)
        expect(writeText).toHaveBeenCalledWith('some text')
      })

      test('forwards a Clipboard API rejection', async () => {
        const err = new Error('denied')
        useClipboardApi(vi.fn(() => Promise.reject(err)))

        await expect(copyToClipboard('some text')).rejects.toBe(err)
      })

      test('falls back to execCommand("copy") and resolves on success', async () => {
        let selectedValue
        const execCommand = vi.fn(cmd => {
          // capture the state of the DOM while the temporary node still exists
          const area = document.querySelector('textarea')
          selectedValue = area?.value
          return cmd === 'copy'
        })

        useExecCommandFallback(execCommand)

        await expect(copyToClipboard('some text')).resolves.toBe(true)

        expect(execCommand).toHaveBeenCalledTimes(1)
        expect(execCommand).toHaveBeenCalledWith('copy')
        expect(selectedValue).toBe('some text')
      })

      test('removes the temporary node used by the fallback', async () => {
        useExecCommandFallback(vi.fn(() => true))

        await copyToClipboard('some text')

        expect(document.querySelector('textarea')).toBeNull()
      })

      test('rejects when the fallback fails to copy', async () => {
        useExecCommandFallback(vi.fn(() => false))

        await expect(copyToClipboard('some text')).rejects.toBe(false)
        expect(document.querySelector('textarea')).toBeNull()
      })
    })
  })
})
