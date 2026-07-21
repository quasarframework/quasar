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
  factory: Function
}

const emits = ['factoryFailed', 'uploaded', 'failed', 'uploading']

function injectPlugin({ props, emit, helpers }) {
  const xhrs = ref([])
  const promises = ref([])
  const workingThreads = ref(0)
  const abortedPromises = new WeakSet()

  const xhrProps = computed(() => ({
    url: getFn(props.url),
    method: getFn(props.method),
    headers: getFn(props.headers),
    formFields: getFn(props.formFields),
    fieldName: getFn(props.fieldName),
    withCredentials: getFn(props.withCredentials),
    sendRaw: getFn(props.sendRaw),
    batch: getFn(props.batch)
  }))

  const isUploading = computed(() => workingThreads.value > 0)
  const isBusy = computed(() => promises.value.length !== 0)

  const getLiveFiles = files =>
    files.filter(file => helpers.files.value.includes(file))

  function abort() {
    xhrs.value.forEach(x => {
      x.abort()
    })

    promises.value.forEach(promise => {
      abortedPromises.add(promise)
    })
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

    const failed = (err, promise) => {
      if (helpers.isAlive()) {
        if (promise !== void 0) {
          promises.value = promises.value.filter(p => p !== promise)
        }

        const liveFiles = getLiveFiles(files)

        if (liveFiles.length !== 0) {
          helpers.queuedFiles.value.push(...liveFiles)
          liveFiles.forEach(f => {
            helpers.updateFileStatus(f, 'failed')
          })

          emit('factoryFailed', err, liveFiles)
        }

        workingThreads.value--
      }
    }

    if (typeof props.factory !== 'function') {
      startUpload({})
      return
    }

    let res
    try {
      res = props.factory(files)
    } catch (err) {
      failed(err)
      return
    }

    if (Object(res) !== res) {
      failed(new Error('QUploader: factory() does not return properly'))
    } else if (
      typeof res.catch === 'function' &&
      typeof res.then === 'function'
    ) {
      promises.value.push(res)

      res
        .then(factory => {
          if (abortedPromises.has(res)) {
            failed(new Error('Aborted'), res)
          } else if (Object(factory) !== factory) {
            failed(
              new Error('QUploader: factory() does not return properly'),
              res
            )
          } else if (helpers.isAlive()) {
            promises.value = promises.value.filter(p => p !== res)
            startUpload(factory)
          }
        })
        .catch(err => {
          failed(err, res)
        })
    } else {
      startUpload(res)
    }

    function startUpload(factory) {
      const liveFiles = getLiveFiles(files)

      if (liveFiles.length === 0) {
        workingThreads.value--
        return
      }

      try {
        performUpload(liveFiles, factory)
      } catch (err) {
        failed(err)
      }
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
      helpers.queuedFiles.value.push(...files)
      files.forEach(f => {
        helpers.updateFileStatus(f, 'failed')
      })
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
            uploaded = size >= file.size

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
        const liveFiles = getLiveFiles(files)
        const liveUploadSize = liveFiles.reduce(
          (total, file) => total + file.size,
          0
        )

        helpers.uploadedSize.value += liveUploadSize - localUploadedSize

        if (liveFiles.length !== 0) {
          helpers.uploadedFiles.value.push(...liveFiles)
          liveFiles.forEach(f => {
            helpers.updateFileStatus(f, 'uploaded')
          })
          emit('uploaded', { files: liveFiles, xhr })
        }
      } else {
        aborted = true
        helpers.uploadedSize.value -= localUploadedSize

        const liveFiles = getLiveFiles(files)
        if (liveFiles.length !== 0) {
          helpers.queuedFiles.value.push(...liveFiles)
          liveFiles.forEach(f => {
            helpers.updateFileStatus(f, 'failed')
          })
          emit('failed', { files: liveFiles, xhr })
        }
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
