function getFn (prop) {
  return typeof prop === 'function'
    ? prop
    : () => prop
}

export default {
  props: {
    url: [Function, String],
    method: {
      type: [Function, String],
      default: 'POST'
    },
    fieldName: {
      type: [Function, String],
      default: file => file.name
    },
    headers: [Function, Array],
    fields: [Function, Array], /* TODO remove in v1 final */
    formFields: [Function, Array],
    withCredentials: [Function, Boolean],
    sendRaw: [Function, Boolean],

    batch: [Function, Boolean],
    factory: Function
  },

  data () {
    return {
      xhrs: [],
      promises: [],
      workingThreads: 0
    }
  },

  computed: {
    xhrProps () {
      return {
        url: getFn(this.url),
        method: getFn(this.method),
        headers: getFn(this.headers),
        fields: getFn(this.fields),
        formFields: getFn(this.formFields),
        fieldName: getFn(this.fieldName),
        withCredentials: getFn(this.withCredentials),
        sendRaw: getFn(this.sendRaw),
        batch: getFn(this.batch)
      }
    },

    isUploading () {
      return this.workingThreads > 0
    },

    isBusy () {
      return this.promises.length > 0
    }
  },

  methods: {
    abort () {
      this.xhrs.forEach(x => { x.abort() })
      this.promises.forEach(p => { p.abort() })
    },

    upload () {
      if (this.canUpload === false) {
        return
      }

      const queue = this.queuedFiles.slice(0)
      this.queuedFiles = []

      if (this.xhrProps.batch(queue)) {
        this.__runFactory(queue)
      }
      else {
        queue.forEach(file => {
          this.__runFactory([ file ])
        })
      }
    },

    __runFactory (payload) {
      this.workingThreads++

      if (typeof this.factory !== 'function') {
        this.__uploadFiles(payload, {})
        return
      }

      const res = this.factory(payload)

      if (!res) {
        this.$emit('factory-fail')
        this.workingThreads--
      }
      else if (typeof res.catch === 'function' && typeof res.then === 'function') {
        this.promises.push(res)

        res.then(factory => {
          if (this.isDestroyed !== true) {
            this.promises = this.promises.filter(p => p !== res)
            this.__uploadFiles(payload, factory)
          }
        }).catch(err => {
          if (this.isDestroyed !== true) {
            this.promises = this.promises.filter(p => p !== res)

            const files = Array.isArray(payload)
              ? payload
              : [ payload ]

            this.queuedFiles = this.queuedFiles.concat(files)
            files.forEach(f => { this.__updateFile(f, 'failed') })

            this.$emit('factory-failed', err, files)
            this.workingThreads--
          }
        })
      }
      else {
        this.__uploadFiles(payload, res || {})
      }
    },

    __uploadFiles (files, factory) {
      const
        form = new FormData(),
        xhr = new XMLHttpRequest()

      const getProp = (name, arg) => {
        return factory[name] !== void 0
          ? getFn(factory[name])(arg)
          : this.xhrProps[name](arg)
      }

      const url = getProp('url', files)

      if (!url) {
        console.error('q-uploader: invalid or no URL specified')
        this.workingThreads--
        return
      }

      const fields = (
        getProp('formFields', files) ||
        /* TODO remove in v1 final */ getProp('fields', files)
      )
      fields !== void 0 && fields.forEach(field => {
        form.append(field.name, field.value)
      })

      let
        uploadIndex = 0,
        uploadIndexSize = 0,
        uploadedSize = 0,
        maxUploadSize = 0,
        aborted

      xhr.upload.addEventListener('progress', e => {
        if (aborted === true) { return }

        const loaded = Math.min(maxUploadSize, e.loaded)

        this.uploadedSize += loaded - uploadedSize
        uploadedSize = loaded

        let size = uploadedSize - uploadIndexSize
        for (let i = uploadIndex; size > 0 && i < files.length; i++) {
          const
            file = files[i],
            uploaded = size > file.size

          if (uploaded) {
            size -= file.size
            uploadIndex++
            uploadIndexSize += file.size
            this.__updateFile(file, 'uploading', file.size)
          }
          else {
            this.__updateFile(file, 'uploading', size)
            return
          }
        }
      }, false)

      xhr.onreadystatechange = () => {
        if (xhr.readyState < 4) {
          return
        }

        if (xhr.status && xhr.status < 400) {
          this.uploadedFiles = this.uploadedFiles.concat(files)
          files.forEach(f => { this.__updateFile(f, 'uploaded') })
          this.__emit('uploaded', { files, xhr })
        }
        else {
          aborted = true
          this.uploadedSize -= uploadedSize
          this.queuedFiles = this.queuedFiles.concat(files)
          files.forEach(f => { this.__updateFile(f, 'failed') })
          this.__emit('failed', { files, xhr })
        }

        this.workingThreads--
        this.xhrs = this.xhrs.filter(x => x !== xhr)
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
        this.__updateFile(file, 'uploading', 0)
        if (sendRaw !== true) {
          form.append(getProp('fieldName', file), file)
        }
        file.xhr = xhr
        file.__abort = xhr.abort
        maxUploadSize += file.size
      })

      this.__emit('uploading', { files, xhr })
      this.xhrs.push(xhr)

      if (sendRaw === true) {
        xhr.send(files)
      }
      else {
        xhr.send(form)
      }
    }
  },

  // TODO remove in v1 final
  mounted () {
    if (this.fields !== void 0) {
      const p = process.env
      if (p.PROD !== true) {
        console.info('\n\n[Quasar] QUploader: please rename "fields" prop to "form-fields"')
      }
    }
  }
}
