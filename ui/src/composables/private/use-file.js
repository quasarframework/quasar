import { h, computed, getCurrentInstance } from 'vue'

import { stopAndPrevent } from '../../utils/event.js'

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

export const useFileEmits = [ 'rejected' ]

export default function ({
  editable,
  dnd,
  getFileInput,
  addFilesToQueue
}) {
  const { props, emit, proxy } = getCurrentInstance()

  const extensions = computed(() => (
    props.accept !== void 0
      ? props.accept.split(',').map(ext => {
          ext = ext.trim()
          if (ext === '*') { // support "*"
            return '*/'
          }
          else if (ext.endsWith('/*')) { // support "image/*" or "*/*"
            ext = ext.slice(0, ext.length - 1)
          }
          return ext.toUpperCase()
        })
      : null
  ))

  const maxFilesNumber = computed(() => parseInt(props.maxFiles, 10))
  const maxTotalSizeNumber = computed(() => parseInt(props.maxTotalSize, 10))

  function pickFiles (e) {
    if (editable.value) {
      const input = getFileInput()
      input && input.click(e)
    }
  }

  function addFiles (files) {
    if (editable.value && files) {
      addFilesToQueue(null, files)
    }
  }

  function processFiles (e, filesToProcess, currentFileList, append) {
    let files = Array.from(filesToProcess || e.target.files)
    const rejectedFiles = []

    const done = () => {
      if (rejectedFiles.length > 0) {
        emit('rejected', rejectedFiles)
      }
    }

    // filter file types
    if (props.accept !== void 0 && extensions.value.indexOf('*/') === -1) {
      files = filterFiles(files, rejectedFiles, 'accept', file => {
        return extensions.value.some(ext => (
          file.type.toUpperCase().startsWith(ext)
          || file.name.toUpperCase().endsWith(ext)
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
      files = [ files[ 0 ] ]
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
    if (typeof props.filter === 'function') {
      const filteredFiles = props.filter(files)
      files = filterFiles(files, rejectedFiles, 'filter', file => {
        return filteredFiles.includes(file)
      })
    }

    if (props.maxFiles !== void 0) {
      let filesNumber = append === true
        ? currentFileList.length
        : 0

      files = filterFiles(files, rejectedFiles, 'max-files', () => {
        filesNumber++
        return filesNumber <= maxFilesNumber.value
      })

      if (files.length === 0) { return done() }
    }

    done()

    if (files.length > 0) {
      return files
    }
  }

  function onDragover (e) {
    stopAndPreventDrag(e)
    dnd.value !== true && (dnd.value = true)
  }

  function onDragleave (e) {
    stopAndPrevent(e)
    dnd.value = false
  }

  function onDrop (e) {
    stopAndPreventDrag(e)
    const files = e.dataTransfer.files

    if (files.length > 0) {
      addFilesToQueue(null, files)
    }

    dnd.value = false
  }

  function getDndNode (type) {
    if (dnd.value === true) {
      return h('div', {
        class: `q-${ type }__dnd absolute-full`,
        onDragenter: stopAndPreventDrag,
        onDragover: stopAndPreventDrag,
        onDragleave,
        onDrop
      })
    }
  }

  // expose public methods
  Object.assign(proxy, { pickFiles, addFiles })

  return {
    pickFiles,
    addFiles,
    onDragover,
    processFiles,
    getDndNode,
    maxFilesNumber,
    maxTotalSizeNumber
  }
}
