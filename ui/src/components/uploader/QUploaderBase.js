import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import QCircularProgress from '../circular-progress/QCircularProgress.js'

import DarkMixin from '../../mixins/dark.js'

import { stop, stopAndPrevent } from '../../utils/event.js'
import { humanStorageSize } from '../../utils/format.js'

export default {
  mixins: [ DarkMixin ],

  props: {
    label: String,

    color: String,
    textColor: String,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,

    multiple: Boolean,
    accept: String,
    maxFileSize: Number,
    maxTotalSize: Number,
    filter: Function,
    noThumbnails: Boolean,
    autoUpload: Boolean,
    hideUploadBtn: Boolean,

    disable: Boolean,
    readonly: Boolean
  },

  provide () {
    return {
      __qUploaderGetInput: this.__getInputControl
    }
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

  watch: {
    isUploading (newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.$emit('start')
      }
      else if (oldVal === true && newVal === false) {
        this.$emit('finish')
      }
    }
  },

  computed: {
    /*
     * When extending:
     *   Required : isUploading
     *   Optional: isBusy
     */

    canUpload () {
      return this.editable === true &&
        this.isBusy !== true &&
        this.isUploading !== true &&
        this.queuedFiles.length > 0
    },

    canAddFiles () {
      return this.editable &&
        this.isUploading !== true &&
        (this.multiple === true || this.queuedFiles.length === 0)
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
    pickFiles (e) {
      if (this.editable) {
        const input = this.__getFileInput()
        input && input.click(e)
      }
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
        const removedFiles = []

        this.files.forEach(file => {
          if (file.__status === 'idle' || file.__status === 'failed') {
            this.uploadSize -= file.size
            removedFiles.push(file)
          }
        })

        if (removedFiles.length > 0) {
          this.files = this.files.filter(f => f.__status !== 'idle' && f.__status !== 'failed')
          this.queuedFiles = []
          this.$emit('removed', removedFiles)
        }
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
      this.$emit('removed', [ file ])
    },

    __getFileInput () {
      return this.$refs.input ||
        this.$el.getElementsByClassName('q-uploader__input')[0]
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
      this.__getFileInput().value = ''

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

      // Cordova/iOS allows selecting multiple files even when the
      // multiple attribute is not specified. We also normalize drag'n'dropped
      // files here:
      if (this.multiple !== true) {
        files = [ files[0] ]
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
        this.$emit('added', files)
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
        this.__addFiles(null, files)
      }

      this.dnd = false
    },

    __getBtn (h, show, icon, fn) {
      if (show === true) {
        return h(QBtn, {
          props: {
            type: 'a',
            icon: this.$q.iconSet.uploader[icon],
            flat: true,
            dense: true
          },
          on: icon === 'add' ? null : { click: fn }
        }, icon === 'add' ? this.__getInputControl(h) : null)
      }
    },

    __getInputControl (h) {
      return [
        h('input', {
          ref: 'input',
          staticClass: 'q-uploader__input overflow-hidden absolute-full',
          attrs: {
            tabindex: -1,
            type: 'file',
            title: '', // try to remove default tooltip
            accept: this.accept,
            ...(this.multiple === true ? { multiple: true } : {})
          },
          on: {
            mousedown: stop, // need to stop refocus from QBtn
            change: this.__addFiles
          }
        })
      ]
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

        this.__getBtn(h, this.canAddFiles, 'add', this.pickFiles),
        this.__getBtn(h, this.hideUploadBtn === false && this.canUpload === true, 'upload', this.upload),
        this.__getBtn(h, this.isUploading, 'clear', this.abort)
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
                name: this.$q.iconSet.type.negative,
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
                icon: this.$q.iconSet.uploader[file.__status === 'uploaded' ? 'done' : 'clear']
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
    this.isUploading === true && this.abort()
  },

  render (h) {
    return h('div', {
      staticClass: 'q-uploader column no-wrap',
      class: {
        'q-uploader--dark q-dark': this.isDark,
        'q-uploader--bordered': this.bordered,
        'q-uploader--square no-border-radius': this.square,
        'q-uploader--flat no-shadow': this.flat,
        'disabled q-uploader--disable': this.disable
      },
      on: this.canAddFiles === true
        ? { dragover: this.__onDragOver }
        : null
    }, [
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
      }) : null,

      this.isBusy === true ? h('div', {
        staticClass: 'q-uploader__overlay absolute-full flex flex-center'
      }, [
        h(QSpinner)
      ]) : null
    ])
  }
}
