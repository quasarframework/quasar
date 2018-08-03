import QInputFrame from '../input-frame/QInputFrame.js'
import FrameMixin from '../../mixins/input-frame.js'
import { humanStorageSize } from '../../utils/format.js'
import QSpinner from '../spinner/QSpinner.js'
import QIcon from '../icon/QIcon.js'
import QProgress from '../progress/QProgress.js'
import QList from '../list/QList.js'
import QItem from '../list/QItem.js'
import QItemSide from '../list/QItemSide.js'
import QItemMain from '../list/QItemMain.js'
import QItemTile from '../list/QItemTile.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import { stopAndPrevent } from '../../utils/event'

function initFile (file) {
  file.__doneUploading = false
  file.__failed = false
  file.__uploaded = 0
  file.__progress = 0
}

export default {
  name: 'QUploader',
  mixins: [FrameMixin],
  props: {
    name: {
      type: String,
      default: 'file'
    },
    headers: Object,
    url: {
      type: String,
      required: true
    },
    urlFactory: {
      type: Function,
      required: false
    },
    uploadFactory: Function,
    additionalFields: {
      type: Array,
      default: () => []
    },
    noContentType: Boolean,
    method: {
      type: String,
      default: 'POST'
    },
    extensions: String,
    multiple: Boolean,
    hideUploadButton: Boolean,
    hideUploadProgress: Boolean,
    noThumbnails: Boolean,
    autoExpand: Boolean,
    expandStyle: [Array, String, Object],
    expandClass: [Array, String, Object],
    withCredentials: Boolean,
    sendRaw: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      queue: [],
      files: [],
      uploading: false,
      uploadedSize: 0,
      totalSize: 0,
      xhrs: [],
      focused: false,
      dnd: false,
      expanded: false
    }
  },
  computed: {
    queueLength () {
      return this.queue.length
    },
    hasExpandedContent () {
      return this.files.length > 0
    },
    label () {
      const total = humanStorageSize(this.totalSize)
      return this.uploading
        ? `${(this.progress).toFixed(2)}% (${humanStorageSize(this.uploadedSize)} / ${total})`
        : `${this.queueLength} (${total})`
    },
    progress () {
      return this.totalSize ? Math.min(99.99, this.uploadedSize / this.totalSize * 100) : 0
    },
    addDisabled () {
      return !this.multiple && this.queueLength >= 1
    },
    filesStyle () {
      if (this.maxHeight) {
        return { maxHeight: this.maxHeight }
      }
    },
    dndClass () {
      const cls = [`text-${this.color}`]
      if (this.isInverted) {
        cls.push('inverted')
      }
      return cls
    },
    classes () {
      return {
        'q-uploader-expanded': this.expanded,
        'q-uploader-dark': this.dark,
        'q-uploader-files-no-border': this.isInverted || !this.hideUnderline
      }
    },
    progressColor () {
      return this.dark ? 'white' : 'grey'
    },
    computedExtensions () {
      if (this.extensions) {
        return this.extensions.split(',').map(ext => {
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
  watch: {
    hasExpandedContent (v) {
      if (v === false) {
        this.expanded = false
      }
      else if (this.autoExpand) {
        this.expanded = true
      }
    }
  },
  methods: {
    add (files) {
      if (files) {
        this.__add(null, files)
      }
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
      this.dnd = false
      let files = e.dataTransfer.files

      if (files.length === 0) {
        return
      }

      files = this.multiple ? files : [ files[0] ]
      if (this.extensions) {
        files = this.__filter(files)
        if (files.length === 0) {
          return
        }
      }

      this.__add(null, files)
    },
    __filter (files) {
      return Array.prototype.filter.call(files, file => {
        return this.computedExtensions.some(ext => {
          return file.type.toUpperCase().startsWith(ext.toUpperCase()) ||
            file.name.toUpperCase().endsWith(ext.toUpperCase())
        })
      })
    },
    __add (e, files) {
      if (this.addDisabled) {
        return
      }

      files = Array.prototype.slice.call(files || e.target.files)
      this.$refs.file.value = ''

      let filesReady = [] // List of image load promises
      files = files.filter(file => !this.queue.some(f => file.name === f.name))
        .map(file => {
          initFile(file)
          file.__size = humanStorageSize(file.size)
          file.__timestamp = new Date().getTime()

          if (this.noThumbnails || !file.type.toUpperCase().startsWith('IMAGE')) {
            this.queue.push(file)
          }
          else {
            const reader = new FileReader()
            let p = new Promise((resolve, reject) => {
              reader.onload = e => {
                let img = new Image()
                img.src = e.target.result
                file.__img = img
                this.queue.push(file)
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

      if (files.length > 0) {
        this.files = this.files.concat(files)
        Promise.all(filesReady).then(() => {
          this.$emit('add', files)
        })
        this.__computeTotalSize()
      }
    },
    __computeTotalSize () {
      this.totalSize = this.queueLength
        ? this.queue.map(f => f.size).reduce((total, size) => total + size)
        : 0
    },
    __remove (file) {
      const
        name = file.name,
        done = file.__doneUploading

      if (this.uploading && !done) {
        this.$emit('remove:abort', file, file.xhr)
        file.xhr && file.xhr.abort()
        this.uploadedSize -= file.__uploaded
      }
      else {
        this.$emit(`remove:${done ? 'done' : 'cancel'}`, file, file.xhr)
      }

      if (!done) {
        this.queue = this.queue.filter(obj => obj.name !== name)
      }

      file.__removed = true
      this.files = this.files.filter(obj => obj.name !== name)

      if (!this.files.length) {
        this.uploading = false
      }

      this.__computeTotalSize()
    },
    __pick () {
      if (!this.addDisabled && this.$q.platform.is.mozilla) {
        this.$refs.file.click()
      }
    },
    __getUploadPromise (file) {
      initFile(file)

      if (this.uploadFactory) {
        const updateProgress = (percentage) => {
          let uploaded = percentage * file.size
          this.uploadedSize += uploaded - file.__uploaded
          file.__uploaded = uploaded
          file.__progress = Math.min(99, parseInt(percentage * 100, 10))
          this.$forceUpdate()
        }

        return new Promise((resolve, reject) => {
          this.uploadFactory(file, updateProgress)
            .then(file => {
              file.__doneUploading = true
              file.__progress = 100
              this.$emit('uploaded', file)
              this.$forceUpdate()
              resolve(file)
            })
            .catch(error => {
              file.__failed = true
              this.$emit('fail', file)
              this.$forceUpdate()
              reject(error)
            })
        })
      }

      const
        form = new FormData(),
        xhr = new XMLHttpRequest()

      try {
        this.additionalFields.forEach(field => {
          form.append(field.name, field.value)
        })
        if (this.noContentType !== true) {
          form.append('Content-Type', file.type || 'application/octet-stream')
        }
        form.append(this.name, file)
      }
      catch (e) {
        return
      }

      file.xhr = xhr
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', e => {
          if (file.__removed) { return }
          e.percent = e.total ? e.loaded / e.total : 0
          let uploaded = e.percent * file.size
          this.uploadedSize += uploaded - file.__uploaded
          file.__uploaded = uploaded
          file.__progress = Math.min(99, parseInt(e.percent * 100, 10))
        }, false)

        xhr.onreadystatechange = () => {
          if (xhr.readyState < 4) {
            return
          }
          if (xhr.status && xhr.status < 400) {
            file.__doneUploading = true
            file.__progress = 100
            this.$emit('uploaded', file, xhr)
            resolve(file)
          }
          else {
            file.__failed = true
            this.$emit('fail', file, xhr)
            reject(xhr)
          }
        }

        xhr.onerror = () => {
          file.__failed = true
          this.$emit('fail', file, xhr)
          reject(xhr)
        }

        const resolver = this.urlFactory
          ? this.urlFactory(file)
          : Promise.resolve(this.url)

        resolver.then(url => {
          xhr.open(this.method, url, true)
          if (this.withCredentials) {
            xhr.withCredentials = true
          }
          if (this.headers) {
            Object.keys(this.headers).forEach(key => {
              xhr.setRequestHeader(key, this.headers[key])
            })
          }

          this.xhrs.push(xhr)
          if (this.sendRaw) {
            xhr.send(file)
          }
          else {
            xhr.send(form)
          }
        })
      })
    },
    pick () {
      if (!this.addDisabled) {
        this.$refs.file.click()
      }
    },
    upload () {
      const length = this.queueLength
      if (this.disable || length === 0) {
        return
      }

      let filesDone = 0
      this.uploadedSize = 0
      this.uploading = true
      this.xhrs = []
      this.$emit('start')

      let solved = () => {
        filesDone++
        if (filesDone === length) {
          this.uploading = false
          this.xhrs = []
          this.queue = this.queue.filter(f => !f.__doneUploading)
          this.__computeTotalSize()
          this.$emit('finish')
        }
      }

      this.queue
        .map(file => this.__getUploadPromise(file))
        .forEach(promise => {
          promise.then(solved).catch(solved)
        })
    },
    abort () {
      this.xhrs.forEach(xhr => { xhr.abort() })
      this.uploading = false
      this.$emit('abort')
    },
    reset () {
      this.abort()
      this.files = []
      this.queue = []
      this.expanded = false
      this.__computeTotalSize()
      this.$emit('reset')
    }
  },

  render (h) {
    const child = [
      h('div', {
        staticClass: 'col q-input-target ellipsis',
        'class': this.alignClass
      }, [ this.label ])
    ]

    if (this.uploading) {
      child.push(
        h(QSpinner, {
          slot: 'after',
          staticClass: 'q-if-end self-center',
          props: { size: '24px' }
        }),
        h(QIcon, {
          slot: 'after',
          staticClass: 'q-if-end self-center q-if-control',
          props: {
            name: this.$q.icon.uploader[`clear${this.isInverted ? 'Inverted' : ''}`]
          },
          nativeOn: {
            click: this.abort
          }
        })
      )
    }
    else { // not uploading
      child.push(
        h(QIcon, {
          slot: 'after',
          staticClass: 'q-uploader-pick-button self-center q-if-control relative-position overflow-hidden',
          props: {
            name: this.$q.icon.uploader.add
          },
          attrs: {
            disabled: this.addDisabled
          }
        }, [
          h('input', {
            ref: 'file',
            staticClass: 'q-uploader-input absolute-full cursor-pointer',
            attrs: Object.assign({
              type: 'file',
              accept: this.extensions
            }, this.multiple ? { multiple: true } : {}),
            on: {
              change: this.__add
            }
          })
        ])
      )

      if (!this.hideUploadButton) {
        child.push(
          h(QIcon, {
            slot: 'after',
            staticClass: 'q-if-control self-center',
            props: {
              name: this.$q.icon.uploader.upload
            },
            attrs: {
              disabled: this.queueLength === 0
            },
            nativeOn: {
              click: this.upload
            }
          })
        )
      }
    }

    if (this.hasExpandedContent) {
      child.push(
        h(QIcon, {
          slot: 'after',
          staticClass: 'q-if-control generic_transition self-center',
          'class': { 'rotate-180': this.expanded },
          props: {
            name: this.$q.icon.uploader.expand
          },
          nativeOn: {
            click: () => { this.expanded = !this.expanded }
          }
        })
      )
    }

    return h('div', {
      staticClass: 'q-uploader relative-position',
      'class': this.classes,
      on: { dragover: this.__onDragOver }
    }, [
      h(QInputFrame, {
        ref: 'input',
        props: {
          prefix: this.prefix,
          suffix: this.suffix,
          stackLabel: this.stackLabel,
          floatLabel: this.floatLabel,
          error: this.error,
          warning: this.warning,
          readonly: this.readonly,
          inverted: this.inverted,
          invertedLight: this.invertedLight,
          dark: this.dark,
          dense: this.dense,
          box: this.box,
          fullWidth: this.fullWidth,
          outline: this.outline,
          hideUnderline: this.hideUnderline,
          before: this.before,
          after: this.after,
          color: this.color,
          align: this.align,
          noParentField: this.noParentField,
          length: this.queueLength,
          additionalLength: true
        }
      }, child),

      h(QSlideTransition, [
        h('div', {
          'class': this.expandClass,
          style: this.expandStyle,
          directives: [{
            name: 'show',
            value: this.expanded
          }]
        }, [
          h(QList, {
            staticClass: 'q-uploader-files q-py-none scroll',
            style: this.filesStyle,
            props: { dark: this.dark }
          }, this.files.map(file => {
            return h(QItem, {
              key: file.name + file.__timestamp,
              staticClass: 'q-uploader-file q-pa-xs'
            }, [
              (!this.hideUploadProgress && h(QProgress, {
                staticClass: 'q-uploader-progress-bg absolute-full',
                props: {
                  color: file.__failed ? 'negative' : this.progressColor,
                  percentage: file.__progress,
                  height: '100%'
                }
              })) || void 0,

              (!this.hideUploadProgress && h('div', {
                staticClass: 'q-uploader-progress-text absolute'
              }, [ file.__progress + '%' ])) || void 0,

              h(QItemSide, {
                props: file.__img
                  ? { image: file.__img.src }
                  : {
                    icon: this.$q.icon.uploader.file,
                    color: this.color
                  }
              }),

              h(QItemMain, {
                props: {
                  label: file.name,
                  sublabel: file.__size
                }
              }),

              h(QItemSide, { props: { right: true } }, [
                h(QItemTile, {
                  staticClass: 'cursor-pointer',
                  props: {
                    icon: this.$q.icon.uploader[file.__doneUploading ? 'done' : 'clear'],
                    color: this.color
                  },
                  nativeOn: {
                    click: () => { this.__remove(file) }
                  }
                })
              ])
            ])
          }))
        ])
      ]),

      (this.dnd && h('div', {
        staticClass: 'q-uploader-dnd flex row items-center justify-center absolute-full',
        'class': this.dndClass,
        on: {
          dragenter: stopAndPrevent,
          dragover: stopAndPrevent,
          dragleave: this.__onDragLeave,
          drop: this.__onDrop
        }
      })) || void 0
    ])
  }
}
