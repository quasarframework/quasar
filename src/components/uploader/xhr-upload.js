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
    xhrHeaders: [Function, Array]
  },

  computed: {
    xhrProps () {
      return {
        url: getFn(this.xhrUrl),
        method: getFn(this.xhrMethod),
        headers: getFn(this.xhrHeaders)
      }
    }
  },

  methods: {
    abort () {
      if (!this.disable || this.isUploading) {
        this.xhr.abort()
      }
    },

    upload () {
      if (this.disable || this.isUploading || !this.queue.length) { return }

      if (this.xhrUrl === void 0) {
        console.error('q-uploader: no xhr-url prop specified')
        return
      }

      const form = new FormData()
      this.xhr = new XMLHttpRequest()

      if (this.xhrHeaders !== void 0) {
        const headers = this.xhrProps.headers(this.queue)
        headers !== void 0 && headers.forEach(field => {
          form.append(field.name, field.value)
        })
      }

      this.queue.forEach(file => {
        form.append(file.name, file)
      })

      this.xhr.upload.addEventListener('progress', e => {
        this.uploadedSize = e.loaded || 0
      }, false)

      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState < 4) {
          return
        }

        if (this.xhr.status && this.xhr.status < 400) {
          this.status = 'done'
          this.uploadedSize = this.uploadSize
          this.queue.forEach(f => { f.__status = 'done' })
          this.$emit('uploaded', { files: this.queue, xhr: this.xhr })
        }
        else {
          this.status = 'failed'
          this.queue.forEach(f => { f.__status = 'failed' })
          this.$emit('fail', { files: this.queue, xhr: this.xhr })
        }

        delete this.xhr
      }

      this.status = 'uploading'
      this.queue.forEach(f => { f.__status = 'uploading' })

      this.xhr.open(
        this.xhrProps.method(this.queue),
        this.xhrProps.url(this.queue)
      )
      this.xhr.send(form)
    }
  }
}
