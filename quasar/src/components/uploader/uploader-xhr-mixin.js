function getFn (prop) {
  return typeof prop === 'function'
    ? prop
    : () => prop
}

export default {
  props: {
    url: {
      type: [Function, String],
      required: true
    },
    method: {
      type: [Function, String],
      default: 'POST'
    },
    headers: [Function, Array],
    fields: [Function, Array],
    withCredentials: Boolean,
    batch: [Function, Boolean]
  },

  data () {
    return {
      xhrs: []
    }
  },

  computed: {
    xhrProps () {
      return {
        url: getFn(this.url),
        method: getFn(this.method),
        headers: getFn(this.headers),
        fields: getFn(this.fields),
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

      if (this.url === void 0) {
        console.error('q-uploader: no xhr-url prop specified')
        return
      }

      if (this.xhrProps.batch(this.queuedFiles)) {
        this.__uploadBatch(this.queuedFiles)
      }
      else {
        this.queuedFiles.forEach(file => {
          this.__uploadSingleFile(file)
        })
      }

      this.queuedFiles = []
    },

    __uploadBatch (files) {
      const
        form = new FormData(),
        xhr = new XMLHttpRequest()

      if (this.fields !== void 0) {
        const fields = this.xhrProps.fields(files)
        fields !== void 0 && fields.forEach(field => {
          form.append(field.name, field.value)
        })
      }

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
        this.xhrProps.method(files),
        this.xhrProps.url(files)
      )

      if (this.withCredentials) {
        xhr.withCredentials = true
      }

      if (this.headers !== void 0) {
        const headers = this.xhrProps.headers(files)
        headers !== void 0 && headers.forEach(head => {
          xhr.setRequestHeader(head.name, head.value)
        })
      }

      files.forEach(file => {
        this.__updateFile(file, 'uploading', 0)
        form.append(file.name, file)
        file.xhr = xhr
        file.__abort = xhr.abort
        maxUploadSize += file.size
      })

      this.__emit('uploading', { files, xhr })
      this.xhrs.push(xhr)

      xhr.send(form)
    },

    __uploadSingleFile (file) {
      const
        form = new FormData(),
        files = [ file ],
        xhr = new XMLHttpRequest()

      if (this.fields !== void 0) {
        const fields = this.xhrProps.fields(files)
        fields !== void 0 && fields.forEach(field => {
          form.append(field.name, field.value)
        })
      }

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
        this.xhrProps.method(files),
        this.xhrProps.url(files)
      )

      if (this.withCredentials) {
        xhr.withCredentials = true
      }

      if (this.headers !== void 0) {
        const headers = this.xhrProps.headers(files)
        headers !== void 0 && headers.forEach(head => {
          xhr.setRequestHeader(head.name, head.value)
        })
      }

      this.xhrs.push(xhr)
      file.xhr = xhr
      file.__abort = xhr.abort
      this.__emit('uploading', { files, xhr })

      form.append(file.name, file)
      xhr.send(form)
    }
  }
}
