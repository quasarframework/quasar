import { computed, getCurrentInstance, h, ref } from 'vue'

import { client } from '../../plugins/platform/Platform.js'
import { stop, stopAndPrevent } from '../../utils/event/event.js'

function filterFiles(files, rejectedFiles, failedPropValidation, filterFn) {
  const acceptedFiles = []

  files.forEach(file => {
    if (filterFn(file)) {
      acceptedFiles.push(file)
    } else {
      rejectedFiles.push({ failedPropValidation, file })
    }
  })

  return acceptedFiles
}

function stopAndPreventDrag(e) {
  if (e?.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }

  stopAndPrevent(e)
}

export const useFileProps = {
  /**
   * Allow multiple file uploads
   *
   * @api prop multiple
   * @type {Boolean}
   * @category behavior
   */
  multiple: Boolean,

  /**
   * Comma separated list of unique file type specifiers
   *
   * @api prop accept
   * @type {String}
   * @category behavior
   * @example '.jpg, .pdf, image/*'
   * @example 'image/jpeg, .pdf'
   */
  accept: String,

  /**
   * Specify that a new file should be captured, and which device should be used
   *
   * @api prop capture
   * @type {String}
   * @category behavior
   * @value 'user'
   * @value 'environment'
   */
  capture: String,

  /**
   * Maximum size of individual file in bytes
   *
   * @api prop max-file-size
   * @type {Number|String}
   * @category behavior
   * @example 1024
   * @example '1048576'
   */
  maxFileSize: [Number, String],

  /**
   * Maximum size of all files combined in bytes
   *
   * @api prop max-total-size
   * @type {Number|String}
   * @category behavior
   */
  maxTotalSize: [Number, String],

  /**
   * Maximum number of files to contain
   *
   * @api prop max-files
   * @type {Number|String}
   * @category behavior
   */
  maxFiles: [Number, String],

  /**
   * Custom filter for added files
   *
   * @api prop filter
   * @type {Function}
   * @category behavior
   * @example files => files.filter(file => file.size === 1024)
   */
  filter: Function
}

export const useFileEmits = [
  /**
   * Emitted after files are picked and some do not pass the validation props
   *
   * @api event rejected
   * @param {Array} rejectedEntries Array of rejected file entries
   */
  'rejected'
]

export default function useFile({
  editable,
  dnd,
  getFileInput,
  addFilesToQueue
}) {
  const { props, emit, proxy } = getCurrentInstance()

  const dndRef = ref(null)

  const extensions = computed(() =>
    props.accept !== void 0
      ? props.accept.split(',').map(ext => {
          ext = ext.trim()
          if (ext === '*') {
            // support "*"
            return '*/'
          } else if (ext.endsWith('/*')) {
            // support "image/*" or "*/*"
            ext = ext.slice(0, -1)
          }
          return ext.toUpperCase()
        })
      : null
  )

  const maxFilesNumber = computed(() => Number.parseInt(props.maxFiles, 10))
  const maxTotalSizeNumber = computed(() =>
    Number.parseInt(props.maxTotalSize, 10)
  )

  /**
   * Trigger file pick; Must be called as a direct consequence of user interaction
   *
   * @api method pickFiles
   * @param {Event} evt JS event object
   */
  function pickFiles(e) {
    if (editable.value) {
      if (e !== Object(e)) {
        e = { target: null }
      }

      if (e.target?.matches('input[type="file"]') === true) {
        // stop propagation if it's not a real pointer event
        if (e.clientX === 0 && e.clientY === 0) stop(e)
      } else {
        const input = getFileInput()
        if (input !== e.target) input?.click(e)
      }
    }
  }

  /**
   * Add files programmatically
   *
   * @api method addFiles
   * @param {Array|FileList} files Array of files or FileList
   */
  function addFiles(files) {
    if (editable.value && files) {
      addFilesToQueue(null, files)
    }
  }

  function processFiles(e, filesToProcess, currentFileList, append) {
    let files = [...(filesToProcess || e.target.files)]
    const rejectedFiles = []

    const done = () => {
      if (rejectedFiles.length !== 0) {
        emit('rejected', rejectedFiles)
      }
    }

    // filter file types
    if (props.accept !== void 0 && !extensions.value.includes('*/')) {
      files = filterFiles(files, rejectedFiles, 'accept', file =>
        extensions.value.some(
          ext =>
            file.type.toUpperCase().startsWith(ext) ||
            file.name.toUpperCase().endsWith(ext)
        )
      )

      if (files.length === 0) return done()
    }

    // filter max file size
    if (props.maxFileSize !== void 0) {
      const maxFileSize = Number.parseInt(props.maxFileSize, 10)
      files = filterFiles(
        files,
        rejectedFiles,
        'max-file-size',
        file => file.size <= maxFileSize
      )

      if (files.length === 0) {
        return done()
      }
    }

    // Cordova/iOS allows selecting multiple files even when the
    // multiple attribute is not specified. We also normalize drag'n'dropped
    // files here:
    if (!props.multiple && files.length !== 0) {
      files = [files[0]]
    }

    // Compute key to use for each file
    files.forEach(file => {
      file.__key =
        file.webkitRelativePath + file.lastModified + file.name + file.size
    })

    if (append) {
      // Avoid duplicate files
      const filenameMap = currentFileList.map(entry => entry.__key)
      files = filterFiles(
        files,
        rejectedFiles,
        'duplicate',
        file => !filenameMap.includes(file.__key)
      )
    }

    if (files.length === 0) {
      return done()
    }

    if (props.maxTotalSize !== void 0) {
      let size = append
        ? currentFileList.reduce((total, file) => total + file.size, 0)
        : 0

      files = filterFiles(files, rejectedFiles, 'max-total-size', file => {
        size += file.size
        return size <= maxTotalSizeNumber.value
      })

      if (files.length === 0) {
        return done()
      }
    }

    // do we have custom filter function?
    if (typeof props.filter === 'function') {
      const filteredFiles = props.filter(files)
      files = filterFiles(files, rejectedFiles, 'filter', file =>
        filteredFiles.includes(file)
      )
    }

    if (props.maxFiles !== void 0) {
      let filesNumber = append ? currentFileList.length : 0

      files = filterFiles(files, rejectedFiles, 'max-files', () => {
        filesNumber++
        return filesNumber <= maxFilesNumber.value
      })

      if (files.length === 0) {
        return done()
      }
    }

    done()

    if (files.length !== 0) {
      return files
    }
  }

  function onDragover(e) {
    stopAndPreventDrag(e)
    if (!dnd.value) dnd.value = true
  }

  function onDragleave(e) {
    stopAndPrevent(e)

    // Safari bug: relatedTarget is null for over 10 years
    // https://bugs.webkit.org/show_bug.cgi?id=66547
    if (
      e.relatedTarget !== null || !client.is.safari
        ? e.relatedTarget !== dndRef.value
        : !document
            .elementsFromPoint(e.clientX, e.clientY)
            .includes(dndRef.value)
    ) {
      dnd.value = false
    }
  }

  function onDrop(e) {
    stopAndPreventDrag(e)
    const files = e.dataTransfer.files

    if (files.length !== 0) {
      addFilesToQueue(null, files)
    }

    dnd.value = false
  }

  function getDndNode(type) {
    if (dnd.value) {
      return h('div', {
        ref: dndRef,
        class: `q-${type}__dnd absolute-full`,
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
    onDragleave,
    processFiles,
    getDndNode,

    maxFilesNumber,
    maxTotalSizeNumber
  }
}
