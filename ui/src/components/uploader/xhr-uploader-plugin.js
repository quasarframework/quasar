import { ref, computed } from 'vue'

function getFn (prop) {
  return typeof prop === 'function'
    ? prop
    : () => prop
}

const props = {
  url: [ Function, String ],
  method: {
    type: [ Function, String ],
    default: 'POST'
  },
  fieldName: {
    type: [ Function, String ],
    default: () => {
      return file => file.name
    }
  },
  headers: [ Function, Array ],
  formFields: [ Function, Array ],
  withCredentials: [ Function, Boolean ],
  sendRaw: [ Function, Boolean ],

  batch: [ Function, Boolean ],
  factory: Function
}

const emits = [ 'factory-failed', 'uploaded', 'failed', 'uploading' ]

function injectPlugin ({ props, emit, helpers }) {
  const xhrs = ref([])
  const promises = ref([])
  const workingThreads = ref(0)

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
  const isBusy = computed(() => promises.value.length > 0)

  let abortPromises

  function abort () {
    xhrs.value.forEach(x => { x.abort() })

    if (promises.value.length > 0) {
      abortPromises = true
    }
  }

  function upload () {
    const queue = helpers.queuedFiles.value.slice(0)
    helpers.queuedFiles.value = []

    if (xhrProps.value.batch(queue)) {
      runFactory(queue)
    }
    else {
      queue.forEach(file => {
        runFactory([ file ])
      })
    }
  }

  function runFactory (files) {
    workingThreads.value++

    if (typeof props.factory !== 'function') {
      performUpload(files, {})
      return
    }

    const res = props.factory(files)

    if (!res) {
      emit(
        'factory-failed',
        new Error('QUploader: factory() does not return properly'),
        files
      )
      workingThreads.value--
    }
    else if (typeof res.catch === 'function' && typeof res.then === 'function') {
      promises.value.push(res)

      const failed = err => {
        if (helpers.isAlive() === true) {
          promises.value = promises.value.filter(p => p !== res)

          if (promises.value.length === 0) {
            abortPromises = false
          }

          helpers.queuedFiles.value = helpers.queuedFiles.value.concat(files)
          files.forEach(f => { helpers.updateFileStatus(f, 'failed') })

          emit('factory-failed', err, files)
          workingThreads.value--
        }
      }

      res.then(factory => {
        if (abortPromises === true) {
          failed(new Error('Aborted'))
        }
        else if (helpers.isAlive() === true) {
          promises.value = promises.value.filter(p => p !== res)
          performUpload(files, factory)
        }
      }).catch(failed)
    }
    else {
      performUpload(files, res || {})
    }
  }

  function performUpload (files, factory) {
    const
      form = new FormData(),
      xhr = new XMLHttpRequest()

    const getProp = (name, arg) => {
      return factory[ name ] !== void 0
        ? getFn(factory[ name ])(arg)
        : xhrProps.value[ name ](arg)
    }

    const url = getProp('url', files)

    if (!url) {
      console.error('q-uploader: invalid or no URL specified')
      workingThreads.value--
      return
    }

    const fields = getProp('formFields', files)
    fields !== void 0 && fields.forEach(field => {
      form.append(field.name, field.value)
    })

    let
      uploadIndex = 0,
      uploadIndexSize = 0,
      localUploadedSize = 0,
      maxUploadSize = 0,
      aborted

    xhr.upload.addEventListener('progress', e => {
      if (aborted === true) { return }

      const loaded = Math.min(maxUploadSize, e.loaded)

      helpers.uploadedSize.value += loaded - localUploadedSize
      localUploadedSize = loaded

      let size = localUploadedSize - uploadIndexSize
      for (let i = uploadIndex; size > 0 && i < files.length; i++) {
        const
          file = files[ i ],
          uploaded = size > file.size

        if (uploaded) {
          size -= file.size
          uploadIndex++
          uploadIndexSize += file.size
          helpers.updateFileStatus(file, 'uploading', file.size)
        }
        else {
          helpers.updateFileStatus(file, 'uploading', size)
          return
        }
      }
    }, false)

    xhr.onreadystatechange = () => {
      if (xhr.readyState < 4) {
        return
      }

      if (xhr.status && xhr.status < 400) {
        helpers.uploadedFiles.value = helpers.uploadedFiles.value.concat(files)
        files.forEach(f => { helpers.updateFileStatus(f, 'uploaded') })
        emit('uploaded', { files, xhr })
      }
      else {
        aborted = true
        helpers.uploadedSize.value -= localUploadedSize
        helpers.queuedFiles.value = helpers.queuedFiles.value.concat(files)
        files.forEach(f => { helpers.updateFileStatus(f, 'failed') })
        emit('failed', { files, xhr })
      }

      workingThreads.value--
      xhrs.value = xhrs.value.filter(x => x !== xhr)
    }

    xhr.open(
      getProp('method', files),
      url
    )

    if (getProp('withCredentials', files) === true) {
      xhr.withCredentials = true
    }

    const headers = getProp('headers', files)
    headers !== void 0 && headers.forEach(head => {
      xhr.setRequestHeader(head.name, head.value)
    })

    const sendRaw = getProp('sendRaw', files)

    files.forEach(file => {
      helpers.updateFileStatus(file, 'uploading', 0)
      if (sendRaw !== true) {
        form.append(getProp('fieldName', file), file, file.name)
      }
      file.xhr = xhr
      file.__abort = () => { xhr.abort() }
      maxUploadSize += file.size
    })

    emit('uploading', { files, xhr })
    xhrs.value.push(xhr)

    if (sendRaw === true) {
      xhr.send(new Blob(files))
    }
    else {
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
  name: 'QUploader',
  props,
  emits,
  injectPlugin
}
