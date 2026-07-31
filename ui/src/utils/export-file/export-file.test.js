import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import exportFile from './export-file.js'

const objectUrl = 'blob:quasar/export-file'

let createObjectURL, revokeObjectURL, clickSpy, lastLink

beforeEach(() => {
  vi.useFakeTimers()

  // jsdom implements neither of the two Object URL methods
  createObjectURL = vi.fn(() => objectUrl)
  revokeObjectURL = vi.fn()
  window.URL.createObjectURL = createObjectURL
  window.URL.revokeObjectURL = revokeObjectURL

  lastLink = void 0
  clickSpy = vi
    .spyOn(HTMLAnchorElement.prototype, 'click')
    .mockImplementation(function onClick() {
      captureLink(this)
    })
})

// captures the temporary node while it is still in the document
function captureLink(el) {
  lastLink = {
    el,
    connected: el.isConnected,
    href: el.getAttribute('href'),
    download: el.getAttribute('download'),
    target: el.getAttribute('target'),
    classList: [...el.classList],
    position: el.style.position
  }
}

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()

  delete window.URL.createObjectURL
  delete window.URL.revokeObjectURL

  vi.restoreAllMocks()
})

function getBlob() {
  return createObjectURL.mock.calls[0][0]
}

describe('[exportFile API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('returns true and triggers a download', () => {
        expect(exportFile('my-file.txt', 'some data')).toBe(true)

        expect(clickSpy).toHaveBeenCalledTimes(1)
        expect(lastLink.connected).toBe(true)
        expect(lastLink.href).toBe(objectUrl)
        expect(lastLink.download).toBe('my-file.txt')
      })

      test('hides the temporary node while it is in the document', () => {
        exportFile('my-file.txt', 'some data')

        expect(lastLink.classList).toContain('hidden')
        expect(lastLink.position).toBe('fixed')
      })

      test('removes the temporary node and revokes the Object URL', () => {
        exportFile('my-file.txt', 'some data')

        expect(lastLink.el.isConnected).toBe(false)
        expect(revokeObjectURL).not.toHaveBeenCalled()

        // the revoke is delayed on purpose (iOS)
        vi.runOnlyPendingTimers()
        expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl)
      })

      test('defaults to a binary mime type', () => {
        exportFile('my-file.bin', 'some data')

        expect(getBlob().type).toBe('application/octet-stream')
      })

      test('accepts the mime type as a string', () => {
        exportFile('my-file.txt', 'some data', 'text/plain')

        expect(getBlob().type).toBe('text/plain')
      })

      test('accepts the mime type through the options object', () => {
        exportFile('my-file.json', '{}', { mimeType: 'application/json' })

        expect(getBlob().type).toBe('application/json')
      })

      test('writes the raw data as-is', async () => {
        exportFile('my-file.txt', 'some data')

        await expect(getBlob().text()).resolves.toBe('some data')
      })

      test('prepends the byte order mark', () => {
        exportFile('my-file.csv', 'a,b', { byteOrderMark: '\uFEFF' })

        // Blob#text() strips a leading BOM when decoding, so compare the
        // byte length instead: the UTF-8 BOM takes up 3 extra bytes
        expect(getBlob().size).toBe(6)
      })

      test('does not prepend anything when no byte order mark is supplied', () => {
        exportFile('my-file.csv', 'a,b')

        expect(getBlob().size).toBe(3)
      })

      test('encodes the raw data when an encoding is supplied', async () => {
        exportFile('my-file.txt', 'héllo', { encoding: 'windows-1252' })

        const blob = getBlob()

        // TextEncoder always emits UTF-8, so the accented char takes 2 bytes
        expect(blob.size).toBe(6)
        await expect(blob.text()).resolves.toBe('héllo')
      })

      test('accepts a Blob as raw data', async () => {
        exportFile('my-file.txt', new Blob(['some data']))

        await expect(getBlob().text()).resolves.toBe('some data')
      })

      test('returns the error and still cleans up when the download fails', () => {
        const err = new Error('nope')
        clickSpy.mockImplementation(function onClick() {
          captureLink(this)
          throw err
        })

        expect(exportFile('my-file.txt', 'some data')).toBe(err)

        expect(lastLink.el.isConnected).toBe(false)
        vi.runOnlyPendingTimers()
        expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl)
      })
    })
  })
})
