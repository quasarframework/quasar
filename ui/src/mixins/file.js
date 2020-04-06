import { stopAndPrevent } from '../utils/event.js'
import { cache } from '../utils/vm.js'

export default {
  props: {
    multiple: Boolean,
    accept: String,
    maxFileSize: Number,
    maxTotalSize: Number,
    filter: Function
  },

  computed: {
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
    pickFiles (e) {
      if (this.editable === true) {
        const input = this.__getFileInput()
        input && input.click(e)
      }
    },

    addFiles (files) {
      if (this.editable && files) {
        this.__addFiles(null, files)
      }
    },

    __processFiles (e, files) {
      files = Array.from(files || e.target.files)

      // filter file types
      if (this.accept !== void 0) {
        files = files.filter(file => {
          return this.extensions.some(ext => (
            file.type.toUpperCase().startsWith(ext.toUpperCase()) ||
            file.name.toUpperCase().endsWith(ext.toUpperCase())
          ))
        })
        if (files.length === 0) { return }
      }

      // filter max file size
      if (this.maxFileSize !== void 0) {
        files = files.filter(file => file.size <= this.maxFileSize)
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
              files = files.slice(0, i)
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

      if (files.length > 0) {
        return files
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
      let files = e.dataTransfer.files

      if (files.length > 0) {
        this.__addFiles(null, files)
      }

      this.dnd = false
    },

    __getDnd (h, type) {
      if (this.dnd === true) {
        return h('div', {
          staticClass: `q-${type}__dnd absolute-full`,
          on: cache(this, 'dnd', {
            dragenter: stopAndPrevent,
            dragover: stopAndPrevent,
            dragleave: this.__onDragLeave,
            drop: this.__onDrop
          })
        })
      }
    }
  }
}

export const FileValueMixin = {
  computed: {
    formDomProps () {
      if (this.type !== 'file') {
        return
      }

      try {
        const dt = 'DataTransfer' in window
          ? new DataTransfer()
          : ('ClipboardEvent' in window
            ? new ClipboardEvent('').clipboardData
            : void 0
          )

        if (Object(this.value) === this.value) {
          ('length' in this.value
            ? Array.from(this.value)
            : [ this.value ]
          ).forEach(file => {
            dt.items.add(file)
          })
        }

        return {
          files: dt.files
        }
      }
      catch (e) {
        return {
          files: void 0
        }
      }
    }
  }
}
