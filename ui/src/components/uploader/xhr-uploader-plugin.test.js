import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { effectScope, nextTick, reactive, ref } from 'vue'

import xhrUploaderPlugin from './xhr-uploader-plugin.js'

/**
 * The plugin talks straight to XMLHttpRequest, so a fake one is installed and
 * driven by the tests. There is no component around it either: injectPlugin()
 * only needs props, an emitter and the helpers the uploader core provides.
 */
let xhrInstances
let NativeXHR

class FakeXHR {
  readyState = 0
  status = 0
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
  respond(status = 200) {
    this.readyState = 4
    this.status = status
    this.listeners.readystatechange?.()
  }

  progress(loaded) {
    const [, fn] = this.upload.addEventListener.mock.calls.find(
      ([name]) => name === 'progress'
    )
    fn({ loaded })
  }
}

const scopes = []

beforeEach(() => {
  xhrInstances = []
  NativeXHR = window.XMLHttpRequest
  window.XMLHttpRequest = FakeXHR
})

afterEach(() => {
  scopes.splice(0).forEach(scope => scope.stop())
  window.XMLHttpRequest = NativeXHR
  vi.restoreAllMocks()
})

function makeFile(name = 'file.txt', { size = 4, type = 'text/plain' } = {}) {
  return new File([new Uint8Array(size)], name, { type })
}

function createPlugin(props = {}) {
  const emit = vi.fn()
  const helpers = {
    files: ref([]),
    queuedFiles: ref([]),
    uploadedFiles: ref([]),
    uploadedSize: ref(0),
    updateFileStatus: vi.fn((file, status, uploadedSize) => {
      file.__status = status
      file.__uploaded = uploadedSize
    }),
    isAlive: vi.fn(() => true)
  }

  const pluginProps = reactive({
    url: 'http://localhost/upload',
    method: 'POST',
    fieldName: file => file.name,
    headers: void 0,
    formFields: void 0,
    withCredentials: void 0,
    sendRaw: void 0,
    batch: void 0,
    factory: void 0,
    ...props
  })

  const scope = effectScope()
  scopes.push(scope)

  const api = scope.run(() =>
    xhrUploaderPlugin.injectPlugin({ props: pluginProps, emit, helpers })
  )

  function queue(...files) {
    helpers.files.value.push(...files)
    helpers.queuedFiles.value.push(...files)
    return files
  }

  return { api, emit, helpers, props: pluginProps, queue }
}

describe('[xhrUploaderPlugin API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)name]', () => {
      test('is defined correctly', () => {
        expect(xhrUploaderPlugin.name).toBe('QUploader')
      })
    })

    describe('[(variable)props]', () => {
      test('is defined correctly', () => {
        expect(xhrUploaderPlugin.props).$props()
      })

      test('defaults the field name to the file name', () => {
        const fieldName = xhrUploaderPlugin.props.fieldName.default()

        expect(fieldName(makeFile('a.txt'))).toBe('a.txt')
      })

      test('defaults the method to POST', () => {
        expect(xhrUploaderPlugin.props.method.default).toBe('POST')
      })
    })

    describe('[(variable)emits]', () => {
      test('is defined correctly', () => {
        expect(xhrUploaderPlugin.emits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)injectPlugin]', () => {
      test('has correct return value', () => {
        const { api } = createPlugin()

        expect(api).toStrictEqual({
          isUploading: expect.$ref(false),
          isBusy: expect.$ref(false),
          abort: expect.any(Function),
          upload: expect.any(Function)
        })
      })

      test('sends one request per queued file', () => {
        const { api, helpers, queue } = createPlugin()

        queue(makeFile('a.txt'), makeFile('b.txt'))
        api.upload()

        expect(xhrInstances).toHaveLength(2)
        expect(helpers.queuedFiles.value).toStrictEqual([])
        expect(api.isUploading.value).toBe(true)
      })

      test('batches every queued file into one request', () => {
        const { api, queue } = createPlugin({ batch: true })

        queue(makeFile('a.txt'), makeFile('b.txt'))
        api.upload()

        expect(xhrInstances).toHaveLength(1)
      })

      test('asks a function whether to batch', () => {
        const batch = vi.fn(() => false)
        const { api, queue } = createPlugin({ batch })
        const files = queue(makeFile('a.txt'), makeFile('b.txt'))

        api.upload()

        expect(batch).toHaveBeenCalledExactlyOnceWith(files)
        expect(xhrInstances).toHaveLength(2)
      })

      test('opens the request the way it was configured', () => {
        const { api, queue } = createPlugin({
          url: 'http://localhost/files',
          method: 'PUT',
          withCredentials: true,
          headers: [{ name: 'X-Token', value: 'abc' }]
        })

        queue(makeFile())
        api.upload()

        const [xhr] = xhrInstances

        expect(xhr.method).toBe('PUT')
        expect(xhr.url).toBe('http://localhost/files')
        expect(xhr.withCredentials).toBe(true)
        expect(xhr.requestHeaders).toStrictEqual({ 'X-Token': 'abc' })
      })

      test.each([
        ['url', 'url', xhr => xhr.url, 'http://localhost/from-fn'],
        ['method', 'method', xhr => xhr.method, 'PATCH']
      ])('resolves the %s through a function', (_, prop, read, value) => {
        const fn = vi.fn(() => value)
        const { api, queue } = createPlugin({ [prop]: fn })
        const files = queue(makeFile())

        api.upload()

        expect(fn).toHaveBeenCalledWith(files)
        expect(read(xhrInstances[0])).toBe(value)
      })

      test('sends the files as form data by default', () => {
        const { api, queue } = createPlugin({
          formFields: [{ name: 'token', value: 'abc' }],
          fieldName: () => 'upload'
        })

        queue(makeFile('a.txt'))
        api.upload()

        const { sent } = xhrInstances[0]

        expect(sent).toBeInstanceOf(FormData)
        expect(sent.get('token')).toBe('abc')
        expect(sent.get('upload')).toBeInstanceOf(File)
      })

      test('sends the raw files when asked to', () => {
        const { api, queue } = createPlugin({ sendRaw: true })

        queue(makeFile())
        api.upload()

        expect(xhrInstances[0].sent).toBeInstanceOf(Blob)
      })

      test('reports the start of an upload', () => {
        const { api, emit, queue } = createPlugin()
        const files = queue(makeFile())

        api.upload()

        expect(emit).toHaveBeenCalledExactlyOnceWith('uploading', {
          files,
          xhr: xhrInstances[0]
        })
        expect(files[0].__status).toBe('uploading')
        expect(files[0].xhr).toBe(xhrInstances[0])
      })

      test('follows the upload progress', () => {
        const { api, helpers, queue } = createPlugin({ batch: true })
        const [first, second] = queue(
          makeFile('a.txt', { size: 10 }),
          makeFile('b.txt', { size: 10 })
        )

        api.upload()
        xhrInstances[0].progress(15)

        expect(helpers.uploadedSize.value).toBe(15)
        expect(first.__status).toBe('uploading')
        expect(first.__uploaded).toBe(10)
        expect(second.__uploaded).toBe(5)
      })

      test('never reports more than the total size', () => {
        const { api, helpers, queue } = createPlugin()

        queue(makeFile('a.txt', { size: 10 }))
        api.upload()
        xhrInstances[0].progress(999)

        expect(helpers.uploadedSize.value).toBe(10)
      })

      test('marks the files as uploaded on success', async () => {
        const { api, emit, helpers, queue } = createPlugin()
        const files = queue(makeFile('a.txt', { size: 10 }))

        api.upload()
        xhrInstances[0].respond(200)
        await nextTick()

        expect(files[0].__status).toBe('uploaded')
        expect(helpers.uploadedFiles.value).toStrictEqual(files)
        expect(helpers.uploadedSize.value).toBe(10)
        expect(emit).toHaveBeenLastCalledWith('uploaded', {
          files,
          xhr: xhrInstances[0]
        })
        expect(api.isUploading.value).toBe(false)
      })

      test('puts the files back in the queue on failure', async () => {
        const { api, emit, helpers, queue } = createPlugin()
        const files = queue(makeFile('a.txt', { size: 10 }))

        api.upload()
        xhrInstances[0].progress(5)
        xhrInstances[0].respond(500)
        await nextTick()

        expect(files[0].__status).toBe('failed')
        expect(helpers.queuedFiles.value).toStrictEqual(files)
        expect(helpers.uploadedSize.value).toBe(0)
        expect(emit).toHaveBeenLastCalledWith('failed', {
          files,
          xhr: xhrInstances[0]
        })
        expect(api.isUploading.value).toBe(false)
      })

      test('ignores a file that was removed meanwhile', async () => {
        const { api, emit, helpers, queue } = createPlugin()
        const files = queue(makeFile())

        api.upload()
        helpers.files.value = []
        xhrInstances[0].respond(200)
        await nextTick()

        expect(helpers.uploadedFiles.value).toStrictEqual([])
        expect(emit).not.toHaveBeenCalledWith('uploaded', expect.anything())
        expect(files[0].__status).toBe('uploading')
      })

      test('refuses to upload without a URL', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const { api, helpers, queue } = createPlugin({ url: void 0 })
        const files = queue(makeFile())

        api.upload()

        expect(errorSpy).toHaveBeenCalledOnce()
        expect(xhrInstances[0].sent).toBeNull()
        expect(helpers.queuedFiles.value).toStrictEqual(files)
        expect(files[0].__status).toBe('failed')
        expect(api.isUploading.value).toBe(false)
      })

      test('aborts every request in flight', () => {
        const { api, queue } = createPlugin()

        queue(makeFile(), makeFile('b.txt'))
        api.upload()
        api.abort()

        expect(xhrInstances.map(xhr => xhr.aborted)).toStrictEqual([true, true])
      })

      test('lets a single file abort itself', () => {
        const { api, queue } = createPlugin()
        const files = queue(makeFile())

        api.upload()
        files[0].__abort()

        expect(xhrInstances[0].aborted).toBe(true)
      })

      test('takes the request details from a factory', () => {
        const factory = vi.fn(() => ({
          url: 'http://localhost/from-factory',
          method: 'PUT',
          headers: [{ name: 'X-From', value: 'factory' }]
        }))
        const { api, queue } = createPlugin({ factory })
        const files = queue(makeFile())

        api.upload()

        expect(factory).toHaveBeenCalledExactlyOnceWith(files)
        expect(xhrInstances[0].url).toBe('http://localhost/from-factory')
        expect(xhrInstances[0].method).toBe('PUT')
        expect(xhrInstances[0].requestHeaders).toStrictEqual({
          'X-From': 'factory'
        })
      })

      test('waits for a factory that returns a promise', async () => {
        let resolveFactory
        const { api, queue } = createPlugin({
          factory: () =>
            new Promise(resolve => {
              resolveFactory = resolve
            })
        })

        queue(makeFile())
        api.upload()

        expect(api.isBusy.value).toBe(true)
        expect(xhrInstances).toHaveLength(0)

        resolveFactory({ url: 'http://localhost/later' })
        await nextTick()

        expect(api.isBusy.value).toBe(false)
        expect(xhrInstances[0].url).toBe('http://localhost/later')
      })

      test.each([
        [
          'it throws',
          () => {
            throw new Error('Boom')
          }
        ],
        ['it returns a primitive', () => 'nope'],
        ['its promise resolves to a primitive', () => Promise.resolve('nope')],
        [
          'its promise rejects',
          () => Promise.reject(new Error('the server said no'))
        ]
      ])('recovers when the factory fails because %s', async (_, factory) => {
        const { api, emit, helpers, queue } = createPlugin({ factory })
        const files = queue(makeFile())

        api.upload()
        await nextTick()
        await nextTick()

        expect(xhrInstances).toHaveLength(0)
        expect(helpers.queuedFiles.value).toStrictEqual(files)
        expect(files[0].__status).toBe('failed')
        expect(emit).toHaveBeenCalledWith(
          'factoryFailed',
          expect.any(Error),
          files
        )
        expect(api.isUploading.value).toBe(false)
      })

      test('gives up on a pending factory once aborted', async () => {
        let resolveFactory
        const { api, emit, helpers, queue } = createPlugin({
          factory: () =>
            new Promise(resolve => {
              resolveFactory = resolve
            })
        })
        const files = queue(makeFile())

        api.upload()
        api.abort()

        resolveFactory({ url: 'http://localhost/later' })
        await nextTick()

        expect(xhrInstances).toHaveLength(0)
        expect(helpers.queuedFiles.value).toStrictEqual(files)
        expect(emit).toHaveBeenCalledWith(
          'factoryFailed',
          expect.objectContaining({ message: 'Aborted' }),
          files
        )
      })

      test('stops caring once the component is gone', async () => {
        const { api, emit, helpers, queue } = createPlugin({
          factory: () => Promise.reject(new Error('too late'))
        })

        queue(makeFile())
        helpers.isAlive.mockReturnValue(false)

        api.upload()
        await nextTick()
        await nextTick()

        expect(emit).not.toHaveBeenCalled()
        expect(api.isUploading.value).toBe(true)
      })
    })
  })
})
