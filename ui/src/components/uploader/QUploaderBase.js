import { h, defineComponent } from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import QCircularProgress from '../circular-progress/QCircularProgress.js'

import FileMixin from '../../mixins/file.js'
import DarkMixin from '../../mixins/dark.js'

import { stop } from '../../utils/event.js'
import { humanStorageSize } from '../../utils/format.js'
import cache from '../../utils/cache.js'

export default defineComponent({
  name: 'QUploaderBase',

  mixins: [ DarkMixin, FileMixin ],

  props: {
    label: String,

    color: String,
    textColor: String,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,

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
      return (
        this.editable === true &&
        this.isUploading !== true &&
        // if single selection and no files are queued:
        (this.multiple === true || this.queuedFiles.length === 0) &&
        // if max-files is set and current number of files does not exceeds it:
        (this.maxFiles === void 0 || this.files.length < this.maxFilesNumber) &&
        // if max-total-size is set and current upload size does not exceeds it:
        (this.maxTotalSize === void 0 || this.uploadSize < this.maxTotalSizeNumber)
      )
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
      return 'q-uploader__header' +
        (this.color !== void 0 ? ` bg-${this.color}` : '') +
        (this.textColor !== void 0 ? ` text-${this.textColor}` : '')
    },

    editable () {
      return this.disable !== true && this.readonly !== true
    },

    classes () {
      return 'q-uploader column no-wrap' +
        (this.isDark === true ? ' q-uploader--dark q-dark' : '') +
        (this.bordered === true ? ' q-uploader--bordered' : '') +
        (this.square === true ? ' q-uploader--square no-border-radius' : '') +
        (this.flat === true ? ' q-uploader--flat no-shadow' : '') +
        (this.disable === true ? ' disabled q-uploader--disable' : '')
    }
  },

  methods: {
    reset () {
      if (!this.disable) {
        this.abort()
        this.uploadedSize = 0
        this.uploadSize = 0
        this.__revokeImgURLs()
        this.files = []
        this.queuedFiles = []
        this.uploadedFiles = []
      }
    },

    removeUploadedFiles () {
      if (!this.disable) {
        this.files = this.files.filter(f => {
          if (f.__status !== 'uploaded') {
            return true
          }

          f._img !== void 0 && window.URL.revokeObjectURL(f._img.src)

          return false
        })
        this.uploadedFiles = []
      }
    },

    removeQueuedFiles () {
      if (!this.disable) {
        const removedFiles = []

        const files = this.files.filter(f => {
          if (f.__status !== 'idle' && f.__status !== 'failed') {
            return true
          }

          this.uploadSize -= f.size
          removedFiles.push(f)

          f._img !== void 0 && window.URL.revokeObjectURL(f._img.src)

          return false
        })

        if (removedFiles.length > 0) {
          this.files = files
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

      this.files = this.files.filter(f => {
        if (f.name !== file.name) {
          return true
        }

        f._img !== void 0 && window.URL.revokeObjectURL(f._img.src)

        return false
      })
      this.queuedFiles = this.queuedFiles.filter(f => f.name !== file.name)
      this.$emit('removed', [ file ])
    },

    __revokeImgURLs () {
      this.files.forEach(f => {
        f._img !== void 0 && window.URL.revokeObjectURL(f._img.src)
      })
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

    __addFiles (e, fileList) {
      const processedFiles = this.__processFiles(e, fileList, this.files, true)

      if (processedFiles === void 0) { return }

      const files = processedFiles
        .filter(file => this.files.findIndex(f => file.name === f.name) === -1)

      this.__getFileInput().value = ''

      if (files === void 0) { return }

      files.forEach(file => {
        this.__updateFile(file, 'idle')
        this.uploadSize += file.size

        if (this.noThumbnails !== true && file.type.toUpperCase().startsWith('IMAGE')) {
          const img = new Image()
          img.src = window.URL.createObjectURL(file)
          file.__img = img
        }
      })

      this.files = this.files.concat(files)
      this.queuedFiles = this.queuedFiles.concat(files)
      this.$emit('added', files)
      this.autoUpload === true && this.upload()
    },

    __getBtn (show, icon, fn) {
      if (show === true) {
        const data = {
          type: 'a',
          icon: this.$q.iconSet.uploader[icon],
          flat: true,
          dense: true
        }

        let child = void 0

        if (icon === 'add') {
          data.onClick = fn
          child = { default: this.__getInputControl }
        }

        return h(QBtn, data, child)
      }
    },

    __getInputControl () {
      const data = {
        ref: 'input',
        class: 'q-uploader__input overflow-hidden absolute-full',
        tabindex: -1,
        type: 'file',
        title: '', // try to remove default tooltip
        accept: this.accept,
        capture: this.capture,
        onMousedown: stop, // need to stop refocus from QBtn
        onChange: this.__addFiles
      }

      if (this.multiple === true) {
        data.multiple = true
      }

      return [ h('input', data) ]
    },

    __getHeader () {
      if (this.$slots.header !== void 0) {
        return this.$slots.header(this)
      }

      return [
        h('div', {
          class: 'q-uploader__header-content flex flex-center no-wrap q-gutter-xs'
        }, [
          this.__getBtn(this.queuedFiles.length > 0, 'removeQueue', this.removeQueuedFiles),
          this.__getBtn(this.uploadedFiles.length > 0, 'removeUploaded', this.removeUploadedFiles),

          this.isUploading === true
            ? h(QSpinner, { class: 'q-uploader__spinner' })
            : null,

          h('div', { class: 'col column justify-center' }, [
            this.label !== void 0
              ? h('div', { class: 'q-uploader__title' }, [ this.label ])
              : null,

            h('div', { class: 'q-uploader__subtitle' }, [
              this.uploadSizeLabel + ' / ' + this.uploadProgressLabel
            ])
          ]),

          this.__getBtn(this.canAddFiles, 'add', this.pickFiles),
          this.__getBtn(this.hideUploadBtn === false && this.canUpload === true, 'upload', this.upload),
          this.__getBtn(this.isUploading, 'clear', this.abort)
        ])
      ]
    },

    __getList () {
      if (this.$slots.list !== void 0) {
        return this.$slots.list(this)
      }

      return this.files.map(file => h('div', {
        key: file.name,
        class: 'q-uploader__file relative-position' +
          (this.noThumbnails !== true && file.__img !== void 0 ? ' q-uploader__file--img' : '') +
          (
            file.__status === 'failed'
              ? ' q-uploader__file--failed'
              : (file.__status === 'uploaded' ? ' q-uploader__file--uploaded' : '')
          ),
        style: this.noThumbnails !== true && file.__img !== void 0
          ? { backgroundImage: 'url("' + file.__img.src + '")' }
          : null
      }, [
        h('div', {
          class: 'q-uploader__file-header row flex-center no-wrap'
        }, [
          file.__status === 'failed'
            ? h(QIcon, {
              class: 'q-uploader__file-status',
              name: this.$q.iconSet.type.negative,
              color: 'negative'
            })
            : null,

          h('div', { class: 'q-uploader__file-header-content col' }, [
            h('div', { class: 'q-uploader__title' }, [ file.name ]),
            h('div', {
              class: 'q-uploader__subtitle row items-center no-wrap'
            }, [
              file.__sizeLabel + ' / ' + file.__progressLabel
            ])
          ]),

          file.__status === 'uploading'
            ? h(QCircularProgress, {
              value: file.__progress,
              min: 0,
              max: 1,
              indeterminate: file.__progress === 0
            })
            : h(QBtn, {
              round: true,
              dense: true,
              flat: true,
              icon: this.$q.iconSet.uploader[file.__status === 'uploaded' ? 'done' : 'clear'],
              onClick: () => { this.removeFile(file) }
            })
        ])
      ]))
    }
  },

  beforeUnmount () {
    this.isUploading === true && this.abort()
    this.files.length > 0 && this.__revokeImgURLs()
  },

  render () {
    const children = [
      h('div', { class: this.colorClass }, this.__getHeader()),
      h('div', { class: 'q-uploader__list scroll' }, this.__getList()),
      this.__getDnd('uploader')
    ]

    this.isBusy === true && children.push(
      h('div', {
        class: 'q-uploader__overlay absolute-full flex flex-center'
      }, [ h(QSpinner) ])
    )

    const data = { class: this.classes }

    if (this.canAddFiles === true) {
      data.onDragover = this.__onDragOver
    }

    return h('div', data, children)
  }
})
