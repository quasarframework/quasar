function getFn (prop) {
  return typeof prop === 'function'
    ? prop
    : () => prop
}

export default {
  props: {
    xhrUrl: [Function, String],
    xhrMethod: {
      type: [Function, String],
      default: 'POST'
    },
    xhrHeaders: [Function, Array],
    xhrBatch: [Function, Boolean]
  },

  data () {
    return {
      xhrs: []
    }
  },

  computed: {
    xhrProps () {
      return {
        url: getFn(this.xhrUrl),
        method: getFn(this.xhrMethod),
        headers: getFn(this.xhrHeaders),
        batch: getFn(this.xhrBatch)
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
      if (this.disable || this.isUploading || !this.queuedFiles.length) { return }

      if (this.xhrUrl === void 0) {
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

      if (this.xhrHeaders !== void 0) {
        const headers = this.xhrProps.headers(files)
        headers !== void 0 && headers.forEach(field => {
          form.append(field.name, field.value)
        })
      }

      let uploadIndex = 0, uploadIndexSize = 0
      xhr.upload.addEventListener('progress', e => {
        const uploadedSize = e.loaded || 0

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
          files.forEach(f => { this.__updateFile(f, 'uploaded') })
          this.uploadedFiles = this.uploadedFiles.concat(files)
        }
        else {
          files.forEach(f => { this.__updateFile(f, 'failed') })
          this.queuedFiles = this.queuedFiles.concat(files)
        }

        this.xhrs = this.xhrs.filter(x => x !== xhr)
      }

      files.forEach(file => {
        this.__updateFile(file, 'uploading', 0)
        form.append(file.name, file)
      })

      xhr.open(
        this.xhrProps.method(files),
        this.xhrProps.url(files)
      )
      this.xhrs.push(xhr)
      xhr.send(form)
    },

    __uploadSingleFile (file) {
      const
        form = new FormData(),
        files = [ file ],
        xhr = new XMLHttpRequest()

      if (this.xhrHeaders !== void 0) {
        const headers = this.xhrProps.headers(files)
        headers !== void 0 && headers.forEach(field => {
          form.append(field.name, field.value)
        })
      }

      xhr.upload.addEventListener('progress', e => {
        file.__status !== 'failed' && this.__updateFile(file, 'uploading', e.loaded || 0)
      }, false)

      xhr.onreadystatechange = () => {
        if (xhr.readyState < 4) {
          return
        }

        if (xhr.status && xhr.status < 400) {
          this.uploadedFiles.push(file)
          this.__updateFile(file, 'uploaded')
        }
        else {
          console.log('failed')
          this.queuedFiles.push(file)
          this.__updateFile(file, 'failed')
        }

        this.xhrs = this.xhrs.filter(x => x !== xhr)
      }

      this.__updateFile(file, 'uploading', 0)
      file.xhr = xhr

      form.append(file.name, file)

      xhr.open(
        this.xhrProps.method(files),
        this.xhrProps.url(files)
      )

      this.xhrs.push(xhr)
      xhr.send(form)
    }
  }
}
