import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'

import Dark from '../../plugins/dark/Dark.js'
import QUploader from './QUploader.js'
import langEn from '../../../lang/en-US.js'

/**
 * The XHR uploader plugin talks to a real XMLHttpRequest, so a fake one
 * is installed to drive the upload outcome from the tests.
 */
let xhrInstances
let NativeXHR

class FakeXHR {
  readyState = 0
  status = 0
  response = ''
  withCredentials = false
  upload = { addEventListener: vi.fn() }
  requestHeaders = {}
  listeners = {}
  sent = null
  aborted = false

  constructor() {
    xhrInstances.push(this)
  }

  addEventListener(name, fn) {
    this.listeners[name] = fn
  }

  setRequestHeader(name, value) {
    this.requestHeaders[name] = value
  }

  open(method, url) {
    this.method = method
    this.url = url
  }

  send(payload) {
    this.sent = payload
  }

  abort() {
    this.aborted = true
  }

  // test helpers
  respond(status = 200, response = 'ok') {
    this.readyState = 4
    this.status = status
    this.response = response
    this.listeners.readystatechange?.()
  }

  progress(loaded, total) {
    const [, fn] = this.upload.addEventListener.mock.calls.find(
      ([name]) => name === 'progress'
    )
    fn({ loaded, total })
  }
}

beforeEach(() => {
  xhrInstances = []
  NativeXHR = window.XMLHttpRequest
  window.XMLHttpRequest = FakeXHR
})

afterEach(() => {
  window.XMLHttpRequest = NativeXHR
  vi.restoreAllMocks()
})

function makeFile(name = 'file.txt', { size = 4, type = 'text/plain' } = {}) {
  return new File([new Uint8Array(size)], name, { type })
}

function mountUploader(props, options) {
  props ||= {}
  options ||= {}

  return mount(QUploader, {
    props: {
      url: 'http://localhost/upload',
      ...props
    },
    ...options
  })
}

function getHeader(wrapper) {
  return wrapper.get('.q-uploader__header')
}

function getSubtitle(wrapper) {
  return wrapper.get('.q-uploader__header .q-uploader__subtitle')
}

function getFileEntries(wrapper) {
  return wrapper.findAll('.q-uploader__file')
}

function getHeaderButtons(wrapper) {
  return wrapper.findAll('.q-uploader__header .q-btn')
}

function getInput(wrapper) {
  return wrapper.get('input[type="file"]')
}

async function addFiles(wrapper, files) {
  wrapper.vm.addFiles(files)
  await nextTick()
}

async function uploadOne(wrapper, file = makeFile()) {
  await addFiles(wrapper, [file])
  wrapper.vm.upload()
  await flushPromises()

  return xhrInstances.at(-1)
}

describe('[QUploader API]', () => {
  describe('[Props]', () => {
    describe('[(prop)factory]', () => {
      test('type Function has effect', async () => {
        const propVal = vi.fn(() => ({ url: 'http://localhost/from-factory' }))
        const wrapper = mountUploader({ url: void 0, factory: propVal })

        const xhr = await uploadOne(wrapper)

        expect(propVal).toHaveBeenCalledTimes(1)
        expect(xhr.url).toBe('http://localhost/from-factory')
      })

      test('reports a rejected factory promise', async () => {
        const propVal = () => Promise.reject(new Error('nope'))
        const wrapper = mountUploader({
          url: void 0,
          factory: propVal,
          onFactoryFailed: () => {}
        })

        await uploadOne(wrapper)

        expect(wrapper.emitted('factoryFailed')).toHaveLength(1)
      })
    })

    describe('[(prop)url]', () => {
      test('type String has effect', async () => {
        const propVal = 'http://localhost/string-url'
        const wrapper = mountUploader({ url: propVal })

        const xhr = await uploadOne(wrapper)

        expect(xhr.url).toBe(propVal)
      })

      test('type Function has effect', async () => {
        const propVal = vi.fn(() => 'http://localhost/fn-url')
        const wrapper = mountUploader({ url: propVal })

        const xhr = await uploadOne(wrapper)

        expect(propVal).toHaveBeenCalledTimes(1)
        expect(xhr.url).toBe('http://localhost/fn-url')
      })
    })

    describe('[(prop)method]', () => {
      async function testMethod(propVal) {
        const wrapper = mountUploader({ method: propVal })

        const xhr = await uploadOne(wrapper)

        expect(xhr.method).toBe(propVal)
      }

      test('value "POST" has effect', async () => {
        await testMethod('POST')
      })

      test('value "PUT" has effect', async () => {
        await testMethod('PUT')
      })

      test('type Function has effect', async () => {
        const wrapper = mountUploader({ method: () => 'PUT' })

        const xhr = await uploadOne(wrapper)

        expect(xhr.method).toBe('PUT')
      })
    })

    describe('[(prop)field-name]', () => {
      test('type String has effect', async () => {
        const propVal = 'attachment'
        const wrapper = mountUploader({ fieldName: propVal })

        const xhr = await uploadOne(wrapper)

        expect([...xhr.sent.keys()]).toStrictEqual([propVal])
      })

      test('type Function has effect', async () => {
        const propVal = vi.fn(file => `field-${file.name}`)
        const wrapper = mountUploader({ fieldName: propVal })

        const xhr = await uploadOne(wrapper, makeFile('a.txt'))

        expect([...xhr.sent.keys()]).toStrictEqual(['field-a.txt'])
      })
    })

    describe('[(prop)headers]', () => {
      test('type Array has effect', async () => {
        const propVal = [{ name: 'X-Test', value: 'abc' }]
        const wrapper = mountUploader({ headers: propVal })

        const xhr = await uploadOne(wrapper)

        expect(xhr.requestHeaders).toStrictEqual({ 'X-Test': 'abc' })
      })

      test('type Function has effect', async () => {
        const propVal = vi.fn(() => [{ name: 'X-Fn', value: 'def' }])
        const wrapper = mountUploader({ headers: propVal })

        const xhr = await uploadOne(wrapper)

        expect(propVal).toHaveBeenCalledTimes(1)
        expect(xhr.requestHeaders).toStrictEqual({ 'X-Fn': 'def' })
      })
    })

    describe('[(prop)form-fields]', () => {
      test('type Array has effect', async () => {
        const propVal = [{ name: 'batchId', value: '42' }]
        const wrapper = mountUploader({ formFields: propVal })

        const xhr = await uploadOne(wrapper)

        expect(xhr.sent.get('batchId')).toBe('42')
      })

      test('type Function has effect', async () => {
        const propVal = vi.fn(() => [{ name: 'fromFn', value: 'yes' }])
        const wrapper = mountUploader({ formFields: propVal })

        const xhr = await uploadOne(wrapper)

        expect(propVal).toHaveBeenCalledTimes(1)
        expect(xhr.sent.get('fromFn')).toBe('yes')
      })
    })

    describe('[(prop)with-credentials]', () => {
      test('type Boolean has effect', async () => {
        const plain = mountUploader()
        const plainXhr = await uploadOne(plain)
        expect(plainXhr.withCredentials).toBe(false)

        const wrapper = mountUploader({ withCredentials: true })
        const xhr = await uploadOne(wrapper)

        expect(xhr.withCredentials).toBe(true)
      })

      test('type Function has effect', async () => {
        const wrapper = mountUploader({ withCredentials: () => true })
        const xhr = await uploadOne(wrapper)

        expect(xhr.withCredentials).toBe(true)
      })
    })

    describe('[(prop)send-raw]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader({ sendRaw: true })

        const xhr = await uploadOne(wrapper)

        // the files go up as a raw Blob, not wrapped into a FormData
        expect(xhr.sent).toBeInstanceOf(Blob)
        expect(xhr.sent).not.toBeInstanceOf(FormData)
      })

      test('type Function has effect', async () => {
        const wrapper = mountUploader({ sendRaw: () => true })

        const xhr = await uploadOne(wrapper)

        expect(xhr.sent).toBeInstanceOf(Blob)
        expect(xhr.sent).not.toBeInstanceOf(FormData)
      })
    })

    describe('[(prop)batch]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader({ batch: true, multiple: true })

        await addFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
        wrapper.vm.upload()
        await flushPromises()

        // both files travel in a single request
        expect(xhrInstances).toHaveLength(1)
        expect([...xhrInstances[0].sent.keys()]).toStrictEqual([
          'a.txt',
          'b.txt'
        ])
      })

      test('type Function has effect', async () => {
        const wrapper = mountUploader({ batch: () => false, multiple: true })

        await addFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])
        wrapper.vm.upload()
        await flushPromises()

        expect(xhrInstances).toHaveLength(2)
      })
    })

    describe('[(prop)multiple]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader()

        expect(getInput(wrapper).attributes('multiple')).toBeUndefined()

        await addFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])

        // only the first one is kept
        expect(wrapper.vm.files).toHaveLength(1)

        await wrapper.setProps({ multiple: true })
        expect(getInput(wrapper).attributes('multiple')).toBe('')

        const multiWrapper = mountUploader({ multiple: true })
        await addFiles(multiWrapper, [makeFile('a.txt'), makeFile('b.txt')])

        expect(multiWrapper.vm.files).toHaveLength(2)
      })
    })

    describe('[(prop)accept]', () => {
      test('type String has effect', async () => {
        const propVal = '.txt'
        const wrapper = mountUploader({
          accept: propVal,
          onRejected: () => {}
        })

        expect(getInput(wrapper).attributes('accept')).toBe(propVal)

        await addFiles(wrapper, [makeFile('a.png', { type: 'image/png' })])

        expect(wrapper.vm.files).toHaveLength(0)
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'accept', file: expect.any(File) }
        ])
      })
    })

    describe('[(prop)capture]', () => {
      function testCapture(propVal) {
        const wrapper = mountUploader({ capture: propVal })

        expect(getInput(wrapper).attributes('capture')).toBe(propVal)
      }

      test('value "user" has effect', () => {
        testCapture('user')
      })

      test('value "environment" has effect', () => {
        testCapture('environment')
      })
    })

    describe('[(prop)max-file-size]', () => {
      async function testMaxFileSize(propVal) {
        const wrapper = mountUploader({
          maxFileSize: propVal,
          onRejected: () => {}
        })

        await addFiles(wrapper, [makeFile('big.txt', { size: 20 })])

        expect(wrapper.vm.files).toHaveLength(0)
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'max-file-size', file: expect.any(File) }
        ])
      }

      test('type Number has effect', async () => {
        await testMaxFileSize(10)
      })

      test('type String has effect', async () => {
        await testMaxFileSize('10')
      })
    })

    describe('[(prop)max-total-size]', () => {
      async function testMaxTotalSize(propVal) {
        const wrapper = mountUploader({
          multiple: true,
          maxTotalSize: propVal,
          onRejected: () => {}
        })

        await addFiles(wrapper, [
          makeFile('a.txt', { size: 6 }),
          makeFile('b.txt', { size: 6 })
        ])

        expect(wrapper.vm.files.map(file => file.name)).toStrictEqual(['a.txt'])
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'max-total-size', file: expect.any(File) }
        ])
      }

      test('type Number has effect', async () => {
        await testMaxTotalSize(10)
      })

      test('type String has effect', async () => {
        await testMaxTotalSize('10')
      })
    })

    describe('[(prop)max-files]', () => {
      async function testMaxFiles(propVal) {
        const wrapper = mountUploader({
          multiple: true,
          maxFiles: propVal,
          onRejected: () => {}
        })

        await addFiles(wrapper, [
          makeFile('a.txt'),
          makeFile('b.txt'),
          makeFile('c.txt')
        ])

        expect(wrapper.vm.files).toHaveLength(2)
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'max-files', file: expect.any(File) }
        ])
      }

      test('type Number has effect', async () => {
        await testMaxFiles(2)
      })

      test('type String has effect', async () => {
        await testMaxFiles('2')
      })
    })

    describe('[(prop)filter]', () => {
      test('type Function has effect', async () => {
        const propVal = files => files.filter(file => file.name !== 'b.txt')
        const wrapper = mountUploader({
          multiple: true,
          filter: propVal,
          onRejected: () => {}
        })

        await addFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])

        expect(wrapper.vm.files.map(file => file.name)).toStrictEqual(['a.txt'])
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'filter', file: expect.any(File) }
        ])
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Upload your files'
        const wrapper = mountUploader()

        expect(wrapper.find('.q-uploader__title').exists()).toBe(false)

        await wrapper.setProps({ label: propVal })

        expect(wrapper.get('.q-uploader__title').text()).toBe(propVal)
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountUploader()

        expect(getHeader(wrapper).classes()).not.toContain(`bg-${propVal}`)

        await wrapper.setProps({ color: propVal })

        expect(getHeader(wrapper).classes()).toContain(`bg-${propVal}`)
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountUploader()

        expect(getHeader(wrapper).classes()).not.toContain(`text-${propVal}`)

        await wrapper.setProps({ textColor: propVal })

        expect(getHeader(wrapper).classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader()

        expect(wrapper.classes()).not.toContain('q-uploader--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-uploader--dark', 'q-dark'])
        )
      })

      test('type null has effect', async () => {
        const wrapper = mountUploader({ dark: null })

        Dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-uploader--dark')

        Dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-uploader--dark')

        Dark.set(false)
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader()

        expect(wrapper.classes()).not.toContain('q-uploader--square')

        await wrapper.setProps({ square: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-uploader--square', 'no-border-radius'])
        )
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader()

        expect(wrapper.classes()).not.toContain('q-uploader--flat')

        await wrapper.setProps({ flat: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-uploader--flat', 'no-shadow'])
        )
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader()

        expect(wrapper.classes()).not.toContain('q-uploader--bordered')

        await wrapper.setProps({ bordered: true })

        expect(wrapper.classes()).toContain('q-uploader--bordered')
      })
    })

    describe('[(prop)no-thumbnails]', () => {
      test('type Boolean has effect', async () => {
        const image = makeFile('a.png', { type: 'image/png' })
        const wrapper = mountUploader()

        await addFiles(wrapper, [image])

        // an image file normally gets a thumbnail
        expect(getFileEntries(wrapper)[0].classes()).toContain(
          'q-uploader__file--img'
        )

        const plainWrapper = mountUploader({ noThumbnails: true })
        await addFiles(plainWrapper, [makeFile('b.png', { type: 'image/png' })])

        expect(getFileEntries(plainWrapper)[0].classes()).not.toContain(
          'q-uploader__file--img'
        )
      })
    })

    describe('[(prop)auto-upload]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader()

        await addFiles(wrapper, [makeFile()])
        expect(xhrInstances).toHaveLength(0)

        const autoWrapper = mountUploader({ autoUpload: true })

        await addFiles(autoWrapper, [makeFile()])
        await flushPromises()

        // it starts the upload as soon as a file lands in the queue
        expect(xhrInstances).toHaveLength(1)
      })
    })

    describe('[(prop)hide-upload-btn]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader()
        await addFiles(wrapper, [makeFile()])

        const withBtn = getHeaderButtons(wrapper).length

        await wrapper.setProps({ hideUploadBtn: true })

        expect(getHeaderButtons(wrapper)).toHaveLength(withBtn - 1)
      })
    })

    describe('[(prop)thumbnail-fit]', () => {
      test('type String has effect', async () => {
        const propVal = 'contain'
        const wrapper = mountUploader({ thumbnailFit: propVal })

        await addFiles(wrapper, [makeFile('a.png', { type: 'image/png' })])

        expect(wrapper.get('.q-uploader__file').$style('backgroundSize')).toBe(
          propVal
        )
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader({ disable: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['disabled', 'q-uploader--disable'])
        )

        await addFiles(wrapper, [makeFile()])

        // nothing can be queued anymore
        expect(wrapper.vm.files).toHaveLength(0)
        expect(wrapper.vm.canAddFiles).toBe(false)
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountUploader({ readonly: true })

        expect(wrapper.classes()).not.toContain('disabled')

        await addFiles(wrapper, [makeFile()])

        expect(wrapper.vm.files).toHaveLength(0)
        expect(wrapper.vm.canAddFiles).toBe(false)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)header]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountUploader(
          {},
          {
            slots: {
              header: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        expect(getHeader(wrapper).text()).toBe(slotContent)

        // it receives the whole public API
        expect(slotScope).toMatchObject({
          files: expect.any(Array),
          queuedFiles: expect.any(Array),
          uploadedFiles: expect.any(Array),
          upload: expect.any(Function),
          reset: expect.any(Function),
          canAddFiles: expect.any(Boolean)
        })
      })
    })

    describe('[(slot)list]', () => {
      test('renders the content', async () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountUploader(
          {},
          {
            slots: {
              list: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        await addFiles(wrapper, [makeFile()])

        expect(wrapper.get('.q-uploader__list').text()).toBe(slotContent)
        expect(getFileEntries(wrapper)).toHaveLength(0)

        expect(slotScope).toMatchObject({
          files: expect.any(Array),
          removeFile: expect.any(Function)
        })
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)uploaded]', () => {
      test('is emitting', async () => {
        const wrapper = mountUploader({ onUploaded: () => {} })

        const xhr = await uploadOne(wrapper)
        xhr.respond(200, 'done')
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('uploaded')
        expect(eventList.uploaded).toHaveLength(1)

        const [info] = eventList.uploaded[0]
        expect(info).toStrictEqual({
          files: expect.any(Array),
          xhr: expect.any(Object)
        })
        expect(wrapper.vm.uploadedFiles).toHaveLength(1)
      })
    })

    describe('[(event)failed]', () => {
      test('is emitting', async () => {
        const wrapper = mountUploader({ onFailed: () => {} })

        const xhr = await uploadOne(wrapper)
        xhr.respond(500, 'nope')
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('failed')
        expect(eventList.failed).toHaveLength(1)

        const [info] = eventList.failed[0]
        expect(info).toStrictEqual({
          files: expect.any(Array),
          xhr: expect.any(Object)
        })
        expect(getFileEntries(wrapper)[0].classes()).toContain(
          'q-uploader__file--failed'
        )
      })
    })

    describe('[(event)uploading]', () => {
      test('is emitting', async () => {
        const wrapper = mountUploader({ onUploading: () => {} })

        await uploadOne(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('uploading')
        expect(eventList.uploading).toHaveLength(1)

        const [info] = eventList.uploading[0]
        expect(info).toStrictEqual({
          files: expect.any(Array),
          xhr: expect.any(Object)
        })
      })
    })

    describe('[(event)factory-failed]', () => {
      test('is emitting', async () => {
        const error = new Error('nope')
        const wrapper = mountUploader({
          url: void 0,
          factory: () => Promise.reject(error),
          onFactoryFailed: () => {}
        })

        await uploadOne(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('factoryFailed')
        expect(eventList.factoryFailed).toHaveLength(1)

        const [err, files] = eventList.factoryFailed[0]
        expect(err).toBe(error)
        expect(Array.isArray(files)).toBe(true)

        // the files go back into the queue
        expect(wrapper.vm.queuedFiles).toHaveLength(1)
      })
    })

    describe('[(event)rejected]', () => {
      test('is emitting', async () => {
        const wrapper = mountUploader({
          multiple: true,
          maxFiles: 1,
          onRejected: () => {}
        })

        await addFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('rejected')
        expect(eventList.rejected).toHaveLength(1)

        const [rejectedEntries] = eventList.rejected[0]
        expect(Array.isArray(rejectedEntries)).toBe(true)
      })
    })

    describe('[(event)added]', () => {
      test('is emitting', async () => {
        const wrapper = mountUploader({ onAdded: () => {} })

        await addFiles(wrapper, [makeFile('a.txt')])

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('added')
        expect(eventList.added).toHaveLength(1)

        const [files] = eventList.added[0]
        expect(files.map(file => file.name)).toStrictEqual(['a.txt'])
      })
    })

    describe('[(event)removed]', () => {
      test('is emitting', async () => {
        const wrapper = mountUploader({ onRemoved: () => {} })

        await addFiles(wrapper, [makeFile('a.txt')])
        wrapper.vm.removeFile(wrapper.vm.files[0])
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('removed')
        expect(eventList.removed).toHaveLength(1)

        const [files] = eventList.removed[0]
        expect(files.map(file => file.name)).toStrictEqual(['a.txt'])
      })
    })

    describe('[(event)start]', () => {
      test('is emitting', async () => {
        const wrapper = mountUploader({ onStart: () => {} })

        await uploadOne(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('start')
        expect(eventList.start).toHaveLength(1)
        expect(eventList.start[0]).toHaveLength(0)
      })
    })

    describe('[(event)finish]', () => {
      test('is emitting', async () => {
        const wrapper = mountUploader({ onFinish: () => {} })

        const xhr = await uploadOne(wrapper)
        expect(wrapper.emitted('finish')).toBeUndefined()

        xhr.respond(200)
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('finish')
        expect(eventList.finish).toHaveLength(1)
        expect(eventList.finish[0]).toHaveLength(0)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)pickFiles]', () => {
      test('should be callable', () => {
        const wrapper = mountUploader()
        const clickSpy = vi.spyOn(getInput(wrapper).element, 'click')

        expect(wrapper.vm.pickFiles(new Event('click'))).toBeUndefined()

        expect(clickSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(method)addFiles]', () => {
      test('should be callable', async () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.addFiles([makeFile('a.txt')])).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.files.map(file => file.name)).toStrictEqual(['a.txt'])
        expect(getFileEntries(wrapper)).toHaveLength(1)
      })
    })

    describe('[(method)upload]', () => {
      test('should be callable', async () => {
        const wrapper = mountUploader()
        await addFiles(wrapper, [makeFile()])

        expect(wrapper.vm.upload()).toBeUndefined()
        await flushPromises()

        expect(xhrInstances).toHaveLength(1)
        expect(wrapper.vm.isUploading).toBe(true)
      })
    })

    describe('[(method)abort]', () => {
      test('should be callable', async () => {
        const wrapper = mountUploader()

        const xhr = await uploadOne(wrapper)

        expect(wrapper.vm.abort()).toBeUndefined()

        expect(xhr.aborted).toBe(true)
      })
    })

    describe('[(method)reset]', () => {
      test('should be callable', async () => {
        const wrapper = mountUploader()
        await addFiles(wrapper, [makeFile()])

        expect(wrapper.vm.reset()).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.files).toHaveLength(0)
        expect(wrapper.vm.uploadedSize).toBe(0)
      })
    })

    describe('[(method)removeUploadedFiles]', () => {
      test('should be callable', async () => {
        const wrapper = mountUploader()

        const xhr = await uploadOne(wrapper)
        xhr.respond(200)
        await flushPromises()

        expect(wrapper.vm.uploadedFiles).toHaveLength(1)

        expect(wrapper.vm.removeUploadedFiles()).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.files).toHaveLength(0)
      })
    })

    describe('[(method)removeQueuedFiles]', () => {
      test('should be callable', async () => {
        const wrapper = mountUploader()
        await addFiles(wrapper, [makeFile()])

        expect(wrapper.vm.queuedFiles).toHaveLength(1)

        expect(wrapper.vm.removeQueuedFiles()).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.files).toHaveLength(0)
      })
    })

    describe('[(method)removeFile]', () => {
      test('should be callable', async () => {
        const wrapper = mountUploader({ multiple: true })
        await addFiles(wrapper, [makeFile('a.txt'), makeFile('b.txt')])

        expect(wrapper.vm.removeFile(wrapper.vm.files[0])).toBeUndefined()
        await nextTick()

        expect(wrapper.vm.files.map(file => file.name)).toStrictEqual(['b.txt'])
      })
    })

    describe('[(method)updateFileStatus]', () => {
      test('should be callable', async () => {
        const wrapper = mountUploader()
        await addFiles(wrapper, [makeFile()])

        expect(
          wrapper.vm.updateFileStatus(wrapper.vm.files[0], 'failed')
        ).toBeUndefined()
        await nextTick()

        expect(getFileEntries(wrapper)[0].classes()).toContain(
          'q-uploader__file--failed'
        )
      })
    })

    describe('[(method)isAlive]', () => {
      test('should be callable', () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.isAlive()).toBe(true)

        wrapper.unmount()

        expect(wrapper.vm.isAlive()).toBe(false)
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)files]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.files).toStrictEqual([])

        await addFiles(wrapper, [makeFile('a.txt')])

        expect(wrapper.vm.files.map(file => file.name)).toStrictEqual(['a.txt'])
      })
    })

    describe('[(computedProp)queuedFiles]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()
        await addFiles(wrapper, [makeFile()])

        expect(wrapper.vm.queuedFiles).toHaveLength(1)

        wrapper.vm.upload()
        await flushPromises()

        // it only holds what is still waiting to go up
        expect(wrapper.vm.queuedFiles).toHaveLength(0)
      })
    })

    describe('[(computedProp)uploadedFiles]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.uploadedFiles).toStrictEqual([])

        const xhr = await uploadOne(wrapper)
        xhr.respond(200)
        await flushPromises()

        expect(wrapper.vm.uploadedFiles).toHaveLength(1)
      })
    })

    describe('[(computedProp)uploadedSize]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.uploadedSize).toBe(0)

        const xhr = await uploadOne(wrapper, makeFile('a.txt', { size: 4 }))
        xhr.respond(200)
        await flushPromises()

        expect(wrapper.vm.uploadedSize).toBe(4)
      })
    })

    describe('[(computedProp)uploadSizeLabel]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.uploadSizeLabel).toBe('0.0B')

        const xhr = await uploadOne(wrapper, makeFile('a.txt', { size: 4 }))
        xhr.respond(200)
        await flushPromises()

        expect(wrapper.vm.uploadSizeLabel).toBe('4.0B')
        expect(getSubtitle(wrapper).text()).toContain('4.0B')
      })
    })

    describe('[(computedProp)uploadProgressLabel]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.uploadProgressLabel).toBe('0.00%')

        const xhr = await uploadOne(wrapper)
        xhr.respond(200)
        await flushPromises()

        expect(wrapper.vm.uploadProgressLabel).toBe('100.00%')
        expect(getSubtitle(wrapper).text()).toContain('100.00%')
      })
    })

    describe('[(computedProp)canAddFiles]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.canAddFiles).toBe(true)

        await wrapper.setProps({ disable: true })

        expect(wrapper.vm.canAddFiles).toBe(false)
      })
    })

    describe('[(computedProp)canUpload]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()

        // there has to be something queued first
        expect(wrapper.vm.canUpload).toBe(false)

        await addFiles(wrapper, [makeFile()])

        expect(wrapper.vm.canUpload).toBe(true)
      })
    })

    describe('[(computedProp)isBusy]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader({
          url: void 0,
          factory: () => new Promise(() => {})
        })

        expect(wrapper.vm.isBusy).toBe(false)

        await addFiles(wrapper, [makeFile()])
        wrapper.vm.upload()
        await flushPromises()

        // it waits for the factory promise to settle
        expect(wrapper.vm.isBusy).toBe(true)
        expect(wrapper.find('.q-uploader__overlay').exists()).toBe(true)
      })
    })

    describe('[(computedProp)isUploading]', () => {
      test('should be exposed', async () => {
        const wrapper = mountUploader()

        expect(wrapper.vm.isUploading).toBe(false)

        const xhr = await uploadOne(wrapper)

        expect(wrapper.vm.isUploading).toBe(true)
        expect(wrapper.find('.q-uploader__spinner').exists()).toBe(true)

        xhr.respond(200)
        await flushPromises()

        expect(wrapper.vm.isUploading).toBe(false)
      })
    })
  })

  describe('[Accessibility]', () => {
    test('names its icon-only controls and the file input', () => {
      const wrapper = mountUploader()
      const { uploader } = langEn

      // the pick-files control and the native input it wraps
      const addBtn = wrapper.get('.q-uploader__header .q-btn')
      expect(addBtn.attributes('aria-label')).toBe(uploader.addFiles)
      expect(wrapper.get('.q-uploader__input').attributes('aria-label')).toBe(
        uploader.addFiles
      )
    })
  })
})
