import { h, computed } from 'vue'

import { stopAndPrevent } from '../utils/event.js'

function filterFiles (files, rejectedFiles, failedPropValidation, filterFn) {
  const acceptedFiles = []

  files.forEach(file => {
    if (filterFn(file) === true) {
      acceptedFiles.push(file)
    }
    else {
      rejectedFiles.push({ failedPropValidation, file })
    }
  })

  return acceptedFiles
}

function stopAndPreventDrag (e) {
  e && e.dataTransfer && (e.dataTransfer.dropEffect = 'copy')
  stopAndPrevent(e)
}

export const useFileProps = {
  multiple: Boolean,
  accept: String,
  capture: String,
  maxFileSize: [ Number, String ],
  maxTotalSize: [ Number, String ],
  maxFiles: [ Number, String ],
  filter: Function
}

export const useFileEmits = ['rejected']

export function useFileDomProps(props) {
  return computed(() => {
    if (props.type !== 'file') { // TODO vue3 - handle QInput separately
      return
    }

    const model = props.modelValue

    try {
      const dt = 'DataTransfer' in window
        ? new DataTransfer()
        : ('ClipboardEvent' in window
            ? new ClipboardEvent('').clipboardData
            : void 0
          )

      if (Object(model) === model) {
        ('length' in model
          ? Array.from(model)
          : [model]
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
  })
}

export function useFile (props, emit) {
  // TODO vue3 - convert & check exports

  const extensions = computed(() => {
    if (props.accept !== void 0) {
      return props.accept.split(',').map(ext => {
        ext = ext.trim()
        if (ext === '*') { // support "*"
          return '*/'
        }
        else if (ext.endsWith('/*')) { // support "image/*" or "*/*"
          ext = ext.slice(0, ext.length - 1)
        }
        return ext.toUpperCase()
      })
    }
  })

  const maxFilesNumber = computed(() =>
    parseInt(props.maxFiles, 10)
  )

  const maxTotalSizeNumber = computed(() =>
    parseInt(props.maxTotalSize, 10)
  )

  function pickFiles (e) {
    if (this.editable) {
      const input = this.__getFileInput()
      input && input.click(e)
    }
  }

  function addFiles (files) {
    if (this.editable && files) {
      this.__addFiles(null, files)
    }
  }

  function __processFiles (e, filesToProcess, currentFileList, append) {
    let files = Array.from(filesToProcess || e.target.files)
    const rejectedFiles = []

    const done = () => {
      if (rejectedFiles.length > 0) {
        emit('rejected', rejectedFiles)
      }
    }

    // filter file types
    if (props.accept !== void 0 && props.extensions.indexOf('*/') === -1) {
      files = filterFiles(files, rejectedFiles, 'accept', file => {
        return this.extensions.some(ext => (
          file.type.toUpperCase().startsWith(ext) ||
          file.name.toUpperCase().endsWith(ext)
        ))
      })

      if (files.length === 0) { return done() }
    }

    // filter max file size
    if (props.maxFileSize !== void 0) {
      const maxFileSize = parseInt(props.maxFileSize, 10)
      files = filterFiles(files, rejectedFiles, 'max-file-size', file => {
        return file.size <= maxFileSize
      })

      if (files.length === 0) { return done() }
    }

    // Cordova/iOS allows selecting multiple files even when the
    // multiple attribute is not specified. We also normalize drag'n'dropped
    // files here:
    if (props.multiple !== true) {
      files = [files[ 0 ]]
    }

    if (props.maxTotalSize !== void 0) {
      let size = append === true
        ? currentFileList.reduce((total, file) => total + file.size, 0)
        : 0

      files = filterFiles(files, rejectedFiles, 'max-total-size', file => {
        size += file.size
        return size <= maxTotalSizeNumber.value
      })

      if (files.length === 0) { return done() }
    }

    // do we have custom filter function?
    if (typeof this.filter === 'function') {
      const filteredFiles = this.filter(files)
      files = filterFiles(files, rejectedFiles, 'filter', file => {
        return filteredFiles.includes(file)
      })
    }

    if (this.maxFiles !== void 0) {
      let filesNumber = append === true
        ? currentFileList.length
        : 0

      files = filterFiles(files, rejectedFiles, 'max-files', () => {
        filesNumber++
        return filesNumber <= this.maxFilesNumber
      })

      if (files.length === 0) { return done() }
    }

    done()

    if (files.length > 0) {
      return files
    }
  }

  function __onDragOver (e) {
    stopAndPreventDrag(e)
    this.dnd !== true && (this.dnd = true)
  }

  function __onDragLeave (e) {
    stopAndPrevent(e)
    this.dnd = false
  }

  function __onDrop (e) {
    stopAndPreventDrag(e)
    const files = e.dataTransfer.files

    if (files.length > 0) {
      this.__addFiles(null, files)
    }

    this.dnd = false
  }

  function __getDnd (type) {
    if (this.dnd === true) {
      return h('div', {
        class: `q-${type}__dnd absolute-full`,
        onDragenter: stopAndPreventDrag,
        onDragover: stopAndPreventDrag,
        onDragleave: this.__onDragLeave,
        onDrop: this.__onDrop
      })
    }
  }
}
