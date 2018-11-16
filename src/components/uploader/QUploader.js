import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QSpinner from '../spinner/QSpinner.js'

import XHRUploadMixin from './xhr-upload.js'

import { stopAndPrevent } from '../../utils/event.js'
import { humanStorageSize } from '../../utils/format.js'

function initFile (file) {
  file.__status = 'idle'
  file.__uploaded = 0
  file.__progress = 0
}

export default Vue.extend({
  name: 'QUploader',

  mixins: [ XHRUploadMixin ],

  props: {
    color: String,
    textColor: String,

    dark: Boolean,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,
    inline: Boolean,

    multiple: Boolean,
    accept: String,
    maxFileSize: [String, Number],
    maxTotalSize: [String, Number],
    filter: Function,
    noThumbnails: Boolean,

    disable: Boolean
  },

  data () {
    return {
      files: [],
      status: 'idle', // idle, uploading, done, failed
      dnd: false,

      uploadedSize: 0,
      uploadSize: 0
    }
  },

  computed: {
    isIdle () {
      return this.status !== 'uploading'
    },

    isUploading () {
      return this.status === 'uploading'
    },

    isDone () {
      return this.status === 'done'
    },

    isFailed () {
      return this.status === 'failed'
    },

    uploadedSizeLabel () {
      return humanStorageSize(this.uploadedSize)
    },

    uploadSizeLabel () {
      return humanStorageSize(this.uploadSize)
    },

    uploadProgress () {
      return this.uploadSize > 0
        ? this.uploadedSize / this.uploadSize
        : 0
    },

    uploadedPercentageLabel () {
      return (this.uploadProgress * 100).toFixed(2) + '%'
    },

    queue () {
      return this.files.filter(f => f.__status !== 'done')
    },

    filesUploadedNumber () {
      return this.files.length - this.queue.length
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
    }
  },

  methods: {
    pick () {
      !this.disable && this.isIdle && this.$refs.input.click()
    },

    add (files) {
      if (!this.disable && this.isIdle && files) {
        this.__addFiles(null, files)
      }
    },

    reset () {
      if (this.disable) { return }

      this.abort()
      this.status = 'idle'
      this.removeAllFiles()
    },

    removeUploadedFiles () {
      if (!this.disable && this.isIdle) {
        this.files = this.files.filter(f => f.__status !== 'done')
        this.__computeTotalSize()
      }
    },

    removeAllFiles () {
      if (!this.disable && this.isIdle) {
        this.files = []
        this.uploadedSize = 0
        this.uploadSize = 0
      }
    },

    removeFile (file) {
      if (!this.disable && this.isIdle) {
        this.files = this.files.filter(f => f.name !== file.name)
        this.__computeTotalSize()
        this.$emit(`remove:${file.__status === 'done' ? 'done' : 'cancel'}`, file)
      }
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

      // do we have custom filter function?
      if (typeof this.filter === 'function') {
        files = this.filter(files)
      }

      if (files.length === 0) { return }

      let filesReady = [] // List of image load promises

      files = files.map(file => {
        initFile(file)

        file.__size = humanStorageSize(file.size)
        file.__timestamp = new Date().getTime()

        if (this.noThumbnails === true || !file.type.toUpperCase().startsWith('IMAGE')) {
          this.files.push(file)
        }
        else {
          const reader = new FileReader()
          let p = new Promise((resolve, reject) => {
            reader.onload = e => {
              let img = new Image()
              img.src = e.target.result
              file.__img = img
              this.files.push(file)
              this.__computeTotalSize()
              resolve(true)
            }
            reader.onerror = e => { reject(e) }
          })

          reader.readAsDataURL(file)
          filesReady.push(p)
        }

        return file
      })

      if (this.uploadedSize !== 0) {
        this.uploadedSize = 0
      }

      Promise.all(filesReady).then(() => {
        this.$emit('add', files)
      })
    },

    __computeTotalSize () {
      this.uploadSize = this.queue.length > 0
        ? this.queue.map(f => f.size).reduce((total, size) => total + size)
        : 0
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

    __getHeader (h) {
      if (this.$scopedSlots.header !== void 0) {
        return this.$scopedSlots.header(this)
      }

      return h('div', {
        staticClass: 'q-uploader__header-content flex flex-center'
      }, [
        'Drag and drop files or',
        h(QBtn, {
          staticClass: 'q-ml-sm',
          props: {
            flat: true,
            dense: true,
            noCaps: true,
            label: 'Browse'
          },
          on: {
            click: this.pick
          }
        })
      ])
    },

    __getList (h) {
      if (this.$scopedSlots.list !== void 0) {
        return this.$scopedSlots.list(this)
      }

      return this.files.map(file => h('div', {
        key: file.name,
        staticClass: 'q-uploader__file relative-position',
        'class': file.__img !== void 0 ? 'q-uploader__file--img' : null,
        style: file.__img !== void 0 ? {
          backgroundImage: 'url(' + file.__img.src + ')'
        } : null
      }, [
        h('div', {
          staticClass: 'q-uploader__file-header row flex-center no-wrap'
        }, [
          h('div', { staticClass: 'q-uploader__file-header-content col' }, [
            h('div', { staticClass: 'q-uploader__title' }, [ file.name ]),
            h('div', {
              staticClass: 'q-uploader__subtitle row items-center no-wrap'
            }, [
              h('div', { staticClass: 'col' }, [ file.__size ]),
              h('div', [ this.uploading === true ? file.__progress : '' ])
            ])
          ]),

          file.__status === 'uploading'
            ? h(QSpinner)
            : h(QBtn, {
              props: {
                round: true,
                dense: true,
                flat: true,
                icon: 'clear'
              },
              on: {
                click: () => { this.removeFile(file) }
              }
            })
        ])
      ]))
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-uploader column no-wrap',
      'class': {
        'q-uploader--dark': this.dark,
        'q-uploader--bordered': this.bordered,
        'q-uploader--square no-border-radius': this.square,
        'q-uploader--flat no-shadow': this.flat,
        'inline': this.inline,
        'disabled': this.disable
      },
      on: this.disable !== true && this.isIdle === true
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
        staticClass: 'q-uploader__header'
      }, [ this.__getHeader(h) ]),

      h('div', {
        staticClass: 'q-uploader__list col scroll'
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
})
