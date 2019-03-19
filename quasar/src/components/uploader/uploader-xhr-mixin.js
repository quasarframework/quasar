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
    fields: [Function, Array],
    withCredentials: [Function, Boolean],
    sendRaw: [Function, Boolean],

    batch: [Function, Boolean],
    factory: Function
  },

  data () {
    return {
      xhrs: [],
      isBusy: false
    }
  },

  computed: {
    xhrProps () {
      return {
        url: getFn(this.url),
        method: getFn(this.method),
        headers: getFn(this.headers),
        fields: getFn(this.fields),
        fieldName: getFn(this.fieldName),
        withCredentials: getFn(this.withCredentials),
        sendRaw: getFn(this.sendRaw),
        batch: getFn(this.batch)
      }
    },

    isIdle () {
      return this.xhrs.length === 0
    },

    isUploading () {
      return this.xhrs.length > 0
    }
  },

  methods: {
    abort () {
      if (!this.disable && this.isUploading) {
        this.xhrs.forEach(x => { x.abort() })
      }
    },

    upload () {
      if (this.disable || !this.queuedFiles.length) { return }

      const queue = this.queuedFiles.slice(0)
      this.queuedFiles = []

      if (this.xhrProps.batch(queue)) {
        this.__runFactory('__uploadBatch', queue)
      }
      else {
        queue.forEach(file => {
          this.__runFactory('__uploadSingleFile', file)
        })
      }
    },

    __runFactory (method, payload) {
      if (typeof this.factory !== 'function') {
        this[method](payload, {})
        return
      }

      const res = this.factory(payload)

      if (!res) {
        this.$emit('factory-fail')
      }
      else if (typeof res.catch === 'function' && typeof res.then === 'function') {
        this.isBusy = true

        res.then(factory => {
          if (this.isDestroyed !== true) {
            this.isBusy = false
            this[method](payload, factory)
          }
        }).catch(err => {
          if (this.isDestroyed !== true) {
            this.isBusy = false

            const files = Array.isArray(payload)
              ? payload
              : [ payload ]

            this.queuedFiles = this.queuedFiles.concat(files)
            files.forEach(f => { this.__updateFile(f, 'failed') })

            this.$emit('factory-failed', err, files)
          }
        })
      }
      else {
        this[method](payload, res || {})
      }
    },

    __uploadBatch (files, factory) {
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
        return
      }

      const fields = getProp('fields', files)
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
    },

    __uploadSingleFile (file, factory) {
      const
        form = new FormData(),
        files = [ file ],
        xhr = new XMLHttpRequest()

      const getProp = (name, arg) => {
        return factory[name] !== void 0
          ? getFn(factory[name])(arg)
          : this.xhrProps[name](arg)
      }

      const url = getProp('url', file)

      if (url === void 0) {
        console.error('q-uploader: no URL prop specified')
        return
      }

      const fields = getProp('fields', files)
      fields !== void 0 && fields.forEach(field => {
        form.append(field.name, field.value)
      })

      xhr.upload.addEventListener('progress', e => {
        if (file.__status !== 'failed') {
          const loaded = Math.min(file.size, e.loaded)
          this.uploadedSize += loaded - file.__uploaded
          this.__updateFile(file, 'uploading', loaded)
        }
      }, false)

      xhr.onreadystatechange = () => {
        if (xhr.readyState < 4) {
          return
        }

        if (xhr.status && xhr.status < 400) {
          this.uploadedFiles.push(file)
          this.__updateFile(file, 'uploaded')
          this.__emit('uploaded', { files, xhr })
          this.uploadedSize += file.size - file.__uploaded
        }
        else {
          this.queuedFiles.push(file)
          this.__updateFile(file, 'failed')
          this.__emit('failed', { files, xhr })
          this.uploadedSize -= file.__uploaded
        }

        this.xhrs = this.xhrs.filter(x => x !== xhr)
      }

      this.__updateFile(file, 'uploading', 0)

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

      this.xhrs.push(xhr)
      file.xhr = xhr
      file.__abort = xhr.abort
      this.__emit('uploading', { files, xhr })

      if (getProp('sendRaw', file) === true) {
        xhr.send(file)
      }
      else {
        form.append(getProp('fieldName', file), file)
        xhr.send(form)
      }
    }
  }
}
