import { computed, ref } from 'vue'

function getFn(prop) {
  return typeof prop === 'function' ? prop : () => prop
}

const name = 'QUploader'

const componentProps = {
  url: [Function, String],
  method: {
    type: [Function, String],
    default: 'POST'
  },
  fieldName: {
    type: [Function, String],
    default: () => file => file.name
  },
  headers: [Function, Array],
  formFields: [Function, Array],
  withCredentials: [Function, Boolean],
  sendRaw: [Function, Boolean],

  batch: [Function, Boolean],

  /**
   * Function which should return an Object or a Promise resolving with an Object
   *
   * @api prop factory
   * @type {Function}
   * @ts-type QUploaderFactoryFn
   * @category upload
   */
  factory: Function
}

const emits = [
  /**
   * Emitted when factory function is supplied with a Promise which is rejected
   *
   * @api event factory-failed
   * @param {Error} err Error object which is the Promise rejection reason
   * @param {Array} files Files which were to get uploaded
   */
  'factoryFailed',

  /**
   * Emitted when file or batch of files is uploaded
   *
   * @api event uploaded
   * @param {Object} info Upload information
   */
  'uploaded',

  /**
   * Emitted when file or batch of files has encountered error while uploading
   *
   * @api event failed
   * @param {Object} info Upload failure information
   */
  'failed',

  /**
   * Emitted when file or batch of files starts uploading
   *
   * @api event uploading
   * @param {Object} info Upload information
   */
  'uploading'
]

function injectPlugin({ props, emit, helpers }) {
  const xhrs = ref([])
  const promises = ref([])
  const workingThreads = ref(0)

  const xhrProps = computed(() => ({
    /**
     * URL or path to the server which handles the upload. Takes String or factory function, which returns String. Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop url
     * @type {String|Function}
     * @category upload
     * @example 'https://example.com/path'
     * @example files => `https://example.com?count=${ files.length }`
     */
    url: getFn(props.url),
    /**
     * HTTP method to use for upload; Takes String or factory function which returns a String; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop method
     * @type {String|Function}
     * @default 'POST'
     * @category upload
     * @example 'POST'
     * @example files => (files.length > 10 ? 'POST' : 'PUT')
     */
    method: getFn(props.method),
    /**
     * Array or a factory function which returns an array; Array consists of objects with header definitions; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop headers
     * @type {Array|Function}
     * @category upload
     * @example [{ name: 'Content-Type', value: 'application/json' }, { name: 'Accept', value: 'application/json' }]
     * @example () => [ { name: 'X-Custom-Timestamp', value: Date.now() }]
     * @example files => [ { name: 'X-Custom-Count', value: files.length }]
     */
    headers: getFn(props.headers),
    /**
     * Array or a factory function which returns an array; Array consists of objects with additional fields definitions (used by Form to be uploaded); Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop form-fields
     * @type {Array|Function}
     * @category upload
     * @example [{ name: 'my-field', value: 'my-value' }]
     * @example () => [ { name: 'my-field', value: 'my-value' }]
     * @example files => [ { name: 'my-field', value: 'my-value' + files.length }]
     */
    formFields: getFn(props.formFields),
    /**
     * Field name for each file upload; This goes into the following header: 'Content-Disposition: form-data; name="__HERE__"; filename="somefile.png"; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop field-name
     * @type {String|Function}
     * @default file => file.name
     * @category upload
     * @example 'backgroundFile'
     * @example file => ('background' + file.name)
     */
    fieldName: getFn(props.fieldName),
    /**
     * Sets withCredentials to true on the XHR that manages the upload; Takes boolean or factory function for Boolean; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop with-credentials
     * @type {Boolean|Function}
     * @category upload
     * @example true
     * @example files => (files.length === 2)
     */
    withCredentials: getFn(props.withCredentials),
    /**
     * Send raw files without wrapping into a Form(); Takes boolean or factory function for Boolean; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop send-raw
     * @type {Boolean|Function}
     * @category upload
     * @example true
     * @example files => (files.length > 2)
     */
    sendRaw: getFn(props.sendRaw),
    /**
     * Upload files in batch (in one XHR request); Takes boolean or factory function for Boolean; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop batch
     * @type {Boolean|Function}
     * @category upload
     * @example files => files.length > 10
     */
    batch: getFn(props.batch)
  }))

  const isUploading = computed(() => workingThreads.value > 0)
  const isBusy = computed(() => promises.value.length !== 0)

  let abortPromises

  /**
   * Abort upload of all files
   *
   * @api method abort
   */
  function abort() {
    xhrs.value.forEach(x => {
      x.abort()
    })

    if (promises.value.length !== 0) abortPromises = true
  }

  function upload() {
    const queue = [...helpers.queuedFiles.value]
    helpers.queuedFiles.value = []

    if (xhrProps.value.batch(queue)) {
      runFactory(queue)
    } else {
      queue.forEach(file => {
        runFactory([file])
      })
    }
  }

  function runFactory(files) {
    workingThreads.value++

    if (typeof props.factory !== 'function') {
      performUpload(files, {})
      return
    }

    const res = props.factory(files)

    if (!res) {
      emit(
        'factoryFailed',
        new Error('QUploader: factory() does not return properly'),
        files
      )
      workingThreads.value--
    } else if (
      typeof res.catch === 'function' &&
      typeof res.then === 'function'
    ) {
      promises.value.push(res)

      const failed = err => {
        if (helpers.isAlive()) {
          promises.value = promises.value.filter(p => p !== res)

          if (promises.value.length === 0) abortPromises = false

          helpers.queuedFiles.value.push(...files)
          files.forEach(f => {
            helpers.updateFileStatus(f, 'failed')
          })

          emit('factoryFailed', err, files)
          workingThreads.value--
        }
      }

      res
        .then(factory => {
          if (abortPromises) {
            failed(new Error('Aborted'))
          } else if (helpers.isAlive()) {
            promises.value = promises.value.filter(p => p !== res)
            performUpload(files, factory)
          }
        })
        .catch(failed)
    } else {
      performUpload(files, res || {})
    }
  }

  function performUpload(files, factory) {
    const form = new FormData(),
      xhr = new XMLHttpRequest()

    const getProp = (propName, arg) =>
      factory[propName] !== void 0
        ? getFn(factory[propName])(arg)
        : xhrProps.value[propName](arg)

    const url = getProp('url', files)

    if (!url) {
      console.error('q-uploader: invalid or no URL specified')
      workingThreads.value--
      return
    }

    const fields = getProp('formFields', files)
    if (fields !== void 0) {
      fields.forEach(field => {
        form.append(field.name, field.value)
      })
    }

    let uploadIndex = 0,
      uploadIndexSize = 0,
      localUploadedSize = 0,
      maxUploadSize = 0,
      aborted

    xhr.upload.addEventListener(
      'progress',
      e => {
        if (aborted) return

        const loaded = Math.min(maxUploadSize, e.loaded)

        helpers.uploadedSize.value += loaded - localUploadedSize
        localUploadedSize = loaded

        let size = localUploadedSize - uploadIndexSize
        for (let i = uploadIndex; size > 0 && i < files.length; i++) {
          const file = files[i],
            uploaded = size > file.size

          if (uploaded) {
            size -= file.size
            uploadIndex++
            uploadIndexSize += file.size
            helpers.updateFileStatus(file, 'uploading', file.size)
          } else {
            helpers.updateFileStatus(file, 'uploading', size)
            return
          }
        }
      },
      false
    )

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState < 4) return

      if (xhr.status && xhr.status < 400) {
        helpers.uploadedFiles.value.push(...files)
        files.forEach(f => {
          helpers.updateFileStatus(f, 'uploaded')
        })
        emit('uploaded', { files, xhr })
      } else {
        aborted = true
        helpers.uploadedSize.value -= localUploadedSize
        helpers.queuedFiles.value.push(...files)
        files.forEach(f => {
          helpers.updateFileStatus(f, 'failed')
        })
        emit('failed', { files, xhr })
      }

      workingThreads.value--
      xhrs.value = xhrs.value.filter(x => x !== xhr)
    })

    xhr.open(getProp('method', files), url)

    if (getProp('withCredentials', files) === true) {
      xhr.withCredentials = true
    }

    const headers = getProp('headers', files)
    if (headers !== void 0) {
      headers.forEach(head => {
        xhr.setRequestHeader(head.name, head.value)
      })
    }

    const sendRaw = getProp('sendRaw', files)

    files.forEach(file => {
      helpers.updateFileStatus(file, 'uploading', 0)
      if (sendRaw !== true) {
        form.append(getProp('fieldName', file), file, file.name)
      }
      file.xhr = xhr
      file.__abort = () => {
        xhr.abort()
      }
      maxUploadSize += file.size
    })

    emit('uploading', { files, xhr })
    xhrs.value.push(xhr)

    if (sendRaw === true) {
      xhr.send(new Blob(files))
    } else {
      xhr.send(form)
    }
  }

  return {
    isUploading,
    isBusy,

    abort,
    upload
  }
}

export default {
  name,
  props: componentProps,
  emits,
  injectPlugin
}
