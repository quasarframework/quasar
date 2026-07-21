import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QUploader from './QUploader.js'

let wrapper
const xhrs = []

class MockXMLHttpRequest {
  constructor() {
    xhrs.push(this)
    this.readyState = 0
    this.status = 0
    this.listeners = {}
    this.upload = { addEventListener: vi.fn() }
    this.abort = vi.fn(() => {
      this.readyState = 4
      this.listeners.readystatechange()
    })
  }

  addEventListener(name, handler) {
    this.listeners[name] = handler
  }

  open() {}

  send() {}

  setRequestHeader() {}
}

beforeEach(() => {
  xhrs.length = 0
  vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest)
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0

  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('[QUploader API]', () => {
  describe('[Methods]', () => {
    describe('[(method)removeFile]', () => {
      test('does not fail an uploading file removed during a synchronous abort', () => {
        const onFailed = vi.fn()
        const onRemoved = vi.fn()

        wrapper = mount(QUploader, {
          props: {
            url: '/upload',
            noThumbnails: true,
            onFailed,
            onRemoved
          }
        })

        const file = new File(['content'], 'file.txt', {
          type: 'text/plain'
        })

        wrapper.vm.addFiles([file])
        wrapper.vm.upload()

        expect(file.__status).toBe('uploading')

        const [xhr] = xhrs
        wrapper.vm.removeFile(file)

        expect(xhr.abort).toHaveBeenCalledOnce()
        expect(onFailed).not.toHaveBeenCalled()
        expect(onRemoved).toHaveBeenCalledOnce()
        expect(onRemoved).toHaveBeenCalledWith([file])
        expect(wrapper.vm.files).toEqual([])
        expect(wrapper.vm.queuedFiles).toEqual([])
      })

      test('only fails remaining live files when aborting a batch', () => {
        const onFailed = vi.fn()
        const onRemoved = vi.fn()

        wrapper = mount(QUploader, {
          props: {
            url: '/upload',
            batch: true,
            multiple: true,
            noThumbnails: true,
            onFailed,
            onRemoved
          }
        })

        const removedFile = new File(['removed'], 'removed.txt', {
          type: 'text/plain'
        })
        const liveFile = new File(['live'], 'live.txt', {
          type: 'text/plain'
        })

        wrapper.vm.addFiles([removedFile, liveFile])
        wrapper.vm.upload()

        const [xhr] = xhrs
        wrapper.vm.removeFile(removedFile)

        expect(xhr.abort).toHaveBeenCalledOnce()
        expect(onFailed).toHaveBeenCalledOnce()
        expect(onFailed.mock.calls[0][0].files).toEqual([liveFile])
        expect(onRemoved).toHaveBeenCalledWith([removedFile])
        expect(wrapper.vm.files).toEqual([liveFile])
        expect(wrapper.vm.queuedFiles).toEqual([liveFile])
        expect(liveFile.__status).toBe('failed')
      })
    })
  })
})
