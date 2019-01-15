import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import QCircularProgress from '../circular-progress/QCircularProgress.js'

import { stopAndPrevent } from '../../utils/event.js'
import { humanStorageSize } from '../../utils/format.js'

export default {
  props: {
    label: String,

    color: String,
    textColor: String,

    dark: Boolean,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,
    inline: Boolean,

    multiple: Boolean,
    accept: String,
    maxFileSize: Number,
    maxTotalSize: Number,
    filter: Function,
    noThumbnails: Boolean,
    autoUpload: Boolean,

    disable: Boolean,
    readonly: Boolean
  },

  data () {
    return {
      files: [],
      queuedFiles: [],
      uploadedFiles: [],
      dnd: false,
      expanded: false,

      uploadSize: 0,
      uploadedSize: 0
    }
  },

  computed: {
    canUpload () {
      return this.editable === true && this.queuedFiles.length > 0
    },

    extensions () {
      if (this.accept !== void 0) {
        return this.accept.split(',').map(ext => {
          ext = ext.trim()
          // support "image/*"
          if (ext.endsWith('/*')) {
            ext = ext.slice(0, ext.length - 1)
          }
          return ext
        })
      }
    },

    uploadProgress () {
      return this.uploadSize === 0
        ? 0
        : this.uploadedSize / this.uploadSize
    },

    uploadProgressLabel () {
      return this.__getProgressLabel(this.uploadProgress)
    },

    uploadedSizeLabel () {
      return humanStorageSize(this.uploadedSize)
    },

    uploadSizeLabel () {
      return humanStorageSize(this.uploadSize)
    },

    colorClass () {
      const cls = []
      this.color !== void 0 && cls.push(`bg-${this.color}`)
      this.textColor !== void 0 && cls.push(`text-${this.textColor}`)
      return cls.join(' ')
    },

    editable () {
      return this.disable !== true && this.readonly !== true
    }
  },

  methods: {
    pickFiles () {
      this.editable && this.$refs.input.click()
    },

    addFiles (files) {
      if (this.editable && files) {
        this.__addFiles(null, files)
      }
    },

    reset () {
      if (!this.disable) {
        this.abort()
        this.uploadedSize = 0
        this.uploadSize = 0
        this.files = []
        this.queuedFiles = []
        this.uploadedFiles = []
      }
    },

    removeUploadedFiles () {
      if (!this.disable) {
        this.files = this.files.filter(f => f.__status !== 'uploaded')
        this.uploadedFiles = []
      }
    },

    removeQueuedFiles () {
      if (!this.disable) {
        this.files.forEach(file => {
          if (file.__status === 'idle' || file.__status === 'failed') {
            this.uploadSize -= file.size
          }
        })

        this.files = this.files.filter(f => f.__status !== 'idle' && f.__status !== 'failed')
        this.queuedFiles = []
      }
    },

    removeFile (file) {
      if (this.disable) { return }

      if (file.__status === 'uploaded') {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== file.name)
      }
      else if (file.__status === 'uploading') {
        file.__abort()
      }
      else {
        this.uploadSize -= file.size
      }

      this.files = this.files.filter(f => f.name !== file.name)
      this.queuedFiles = this.queuedFiles.filter(f => f.name !== file.name)
    },

    __emit (evt, payload) {
      this.$listeners[evt] !== void 0 && this.$emit(evt, payload)
    },

    __getProgressLabel (p) {
      return (p * 100).toFixed(2) + '%'
    },

    __updateFile (file, status, uploadedSize) {
      file.__status = status

      if (status === 'idle') {
        file.__uploaded = 0
        file.__progress = 0
        file.__sizeLabel = humanStorageSize(file.size)
        file.__progressLabel = '0.00%'
        return
      }
      if (status === 'failed') {
        this.$forceUpdate()
        return
      }

      file.__uploaded = status === 'uploaded'
        ? file.size
        : uploadedSize

      file.__progress = status === 'uploaded'
        ? 1
        : Math.min(0.9999, file.__uploaded / file.size)

      file.__progressLabel = this.__getProgressLabel(file.__progress)
      this.$forceUpdate()
    },

    __addFiles (e, files) {
      files = Array.prototype.slice.call(files || e.target.files)
      this.$refs.input.value = ''

      // make sure we don't duplicate files
      files = files.filter(file => !this.files.some(f => file.name === f.name))
      if (files.length === 0) { return }

      // filter file types
      if (this.accept !== void 0) {
        files = Array.prototype.filter.call(files, file => {
          return this.extensions.some(ext => (
            file.type.toUpperCase().startsWith(ext.toUpperCase()) ||
            file.name.toUpperCase().endsWith(ext.toUpperCase())
          ))
        })
        if (files.length === 0) { return }
      }

      // filter max file size
      if (this.maxFileSize !== void 0) {
        files = Array.prototype.filter.call(files, file => file.size <= this.maxFileSize)
        if (files.length === 0) { return }
      }

      if (this.maxTotalSize !== void 0) {
        let size = 0
        for (let i = 0; i < files.length; i++) {
          size += files[i].size
          if (size > this.maxTotalSize) {
            if (i > 0) {
              files = files.slice(0, i - 1)
              break
            }
            else {
              return
            }
          }
        }
        if (files.length === 0) { return }
      }

      // do we have custom filter function?
      if (typeof this.filter === 'function') {
        files = this.filter(files)
      }

      if (files.length === 0) { return }

      let filesReady = [] // List of image load promises

      files.forEach(file => {
        this.__updateFile(file, 'idle')
        this.uploadSize += file.size

        if (this.noThumbnails !== true && file.type.toUpperCase().startsWith('IMAGE')) {
          const reader = new FileReader()
          let p = new Promise((resolve, reject) => {
            reader.onload = e => {
              let img = new Image()
              img.src = e.target.result
              file.__img = img
              resolve(true)
            }
            reader.onerror = e => { reject(e) }
          })

          reader.readAsDataURL(file)
          filesReady.push(p)
        }
      })

      Promise.all(filesReady).then(() => {
        this.files = this.files.concat(files)
        this.queuedFiles = this.queuedFiles.concat(files)
        this.__emit('add', files)
        this.autoUpload === true && this.upload()
      })
    },

    __onDragOver (e) {
      stopAndPrevent(e)
      this.dnd = true
    },

    __onDragLeave (e) {
      stopAndPrevent(e)
      this.dnd = false
    },

    __onDrop (e) {
      stopAndPrevent(e)
      let files = e.dataTransfer.files

      if (files.length > 0) {
        files = this.multiple ? files : [ files[0] ]
        this.__addFiles(null, files)
      }

      this.dnd = false
    },

    __getBtn (h, show, icon, fn) {
      if (show === true) {
        return h(QBtn, {
          props: {
            icon: this.$q.icon.uploader[icon],
            flat: true,
            dense: true
          },
          on: { click: fn }
        })
      }
    },

    __getHeader (h) {
      if (this.$scopedSlots.header !== void 0) {
        return this.$scopedSlots.header(this)
      }

      return h('div', {
        staticClass: 'q-uploader__header-content flex flex-center no-wrap q-gutter-xs'
      }, [
        this.__getBtn(h, this.queuedFiles.length > 0, 'removeQueue', this.removeQueuedFiles),
        this.__getBtn(h, this.uploadedFiles.length > 0, 'removeUploaded', this.removeUploadedFiles),

        this.isUploading === true
          ? h(QSpinner, { staticClass: 'q-uploader__spinner' })
          : null,

        h('div', { staticClass: 'col column justify-center' }, [
          this.label !== void 0
            ? h('div', { staticClass: 'q-uploader__title' }, [ this.label ])
            : null,

          h('div', { staticClass: 'q-uploader__subtitle' }, [
            this.uploadSizeLabel + ' / ' + this.uploadProgressLabel
          ])
        ]),

        this.__getBtn(h, this.editable, 'add', this.pickFiles),
        this.__getBtn(h, this.editable && this.queuedFiles.length > 0, 'upload', this.upload),
        this.__getBtn(h, this.editable && this.isUploading, 'clear', this.abort)
      ])
    },

    __getList (h) {
      if (this.$scopedSlots.list !== void 0) {
        return this.$scopedSlots.list(this)
      }

      return this.files.map(file => h('div', {
        key: file.name,
        staticClass: 'q-uploader__file relative-position',
        class: {
          'q-uploader__file--img': file.__img !== void 0,
          'q-uploader__file--failed': file.__status === 'failed',
          'q-uploader__file--uploaded': file.__status === 'uploaded'
        },
        style: file.__img !== void 0 ? {
          backgroundImage: 'url(' + file.__img.src + ')'
        } : null
      }, [
        h('div', {
          staticClass: 'q-uploader__file-header row flex-center no-wrap'
        }, [
          file.__status === 'failed'
            ? h(QIcon, {
              staticClass: 'q-uploader__file-status',
              props: {
                name: this.$q.icon.type.negative,
                color: 'negative'
              }
            })
            : null,

          h('div', { staticClass: 'q-uploader__file-header-content col' }, [
            h('div', { staticClass: 'q-uploader__title' }, [ file.name ]),
            h('div', {
              staticClass: 'q-uploader__subtitle row items-center no-wrap'
            }, [
              file.__sizeLabel + ' / ' + file.__progressLabel
            ])
          ]),

          file.__status === 'uploading'
            ? h(QCircularProgress, {
              props: {
                value: file.__progress,
                min: 0,
                max: 1,
                indeterminate: file.__progress === 0
              }
            })
            : h(QBtn, {
              props: {
                round: true,
                dense: true,
                flat: true,
                icon: this.$q.icon.uploader[file.__status === 'uploaded' ? 'done' : 'clear']
              },
              on: {
                click: () => { this.removeFile(file) }
              }
            })
        ])
      ]))
    }
  },

  beforeDestroy () {
    this.isUploading && this.abort()
  },

  render (h) {
    return h('div', {
      staticClass: 'q-uploader column no-wrap',
      class: {
        'q-uploader--dark': this.dark,
        'q-uploader--bordered': this.bordered,
        'q-uploader--square no-border-radius': this.square,
        'q-uploader--flat no-shadow': this.flat,
        'inline': this.inline,
        'disabled q-uploader--disable': this.disable
      },
      on: this.editable === true && this.isIdle === true
        ? { dragover: this.__onDragOver }
        : null
    }, [
      h('input', {
        ref: 'input',
        staticClass: 'q-uploader__input',
        attrs: Object.assign({
          type: 'file',
          accept: this.accept
        }, this.multiple ? { multiple: true } : {}),
        on: {
          change: this.__addFiles
        }
      }),

      h('div', {
        staticClass: 'q-uploader__header',
        class: this.colorClass
      }, [
        this.__getHeader(h)
      ]),

      h('div', {
        staticClass: 'q-uploader__list scroll'
      }, this.__getList(h)),

      this.dnd === true ? h('div', {
        staticClass: 'q-uploader__dnd absolute-full',
        on: {
          dragenter: stopAndPrevent,
          dragover: stopAndPrevent,
          dragleave: this.__onDragLeave,
          drop: this.__onDrop
        }
      }) : null
    ])
  }
}
