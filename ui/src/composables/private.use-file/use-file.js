import { computed, getCurrentInstance, h, shallowRef } from 'vue'

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

function parseAccept(accept) {
  return accept.split(',').map(ext => {
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
}

/*
 * The validation pipeline shared by QFile, QUploader and useFilePicker().
 *
 * options - accept, multiple, maxFileSize, maxTotalSize, maxFiles, filter
 *           (same meaning as the useFileProps)
 * currentFileList / append - the files already held, when appending
 *
 * Returns { files, rejected }: the accepted Files (in order) and the
 * { failedPropValidation, file } entries that did not pass.
 */
export function validateFiles(
  filesToProcess,
  options,
  currentFileList = [],
  append = false
) {
  let files = [...filesToProcess]
  const rejected = []
  const done = () => ({ files, rejected })

  // filter file types
  if (options.accept !== void 0) {
    const extensions = parseAccept(options.accept)

    if (!extensions.includes('*/')) {
      files = filterFiles(files, rejected, 'accept', file =>
        extensions.some(
          ext =>
            (ext.endsWith('/')
              ? file.type.toUpperCase().startsWith(ext)
              : file.type.toUpperCase() === ext) ||
            file.name.toUpperCase().endsWith(ext)
        )
      )

      if (files.length === 0) return done()
    }
  }

  // filter max file size
  if (options.maxFileSize !== void 0) {
    const maxFileSize = Number.parseInt(options.maxFileSize, 10)
    files = filterFiles(
      files,
      rejected,
      'max-file-size',
      file => file.size <= maxFileSize
    )

    if (files.length === 0) return done()
  }

  // Cordova/iOS allows selecting multiple files even when the
  // multiple attribute is not specified. We also normalize drag'n'dropped
  // files here:
  if (options.multiple !== true && files.length !== 0) {
    files = [files[0]]
  }

  // Compute key to use for each file
  files.forEach(file => {
    file.__key = JSON.stringify([
      file.webkitRelativePath,
      file.lastModified,
      file.name,
      file.size
    ])
  })

  if (append) {
    // Avoid duplicate files
    const filenameSet = new Set(currentFileList.map(entry => entry.__key))
    files = filterFiles(files, rejected, 'duplicate', file => {
      if (filenameSet.has(file.__key)) return false

      filenameSet.add(file.__key)
      return true
    })
  }

  if (files.length === 0) return done()

  if (options.maxTotalSize !== void 0) {
    const maxTotalSize = Number.parseInt(options.maxTotalSize, 10)
    let size = append
      ? currentFileList.reduce((total, file) => total + file.size, 0)
      : 0

    files = filterFiles(files, rejected, 'max-total-size', file => {
      const newSize = size + file.size
      if (newSize > maxTotalSize) return false

      size = newSize
      return true
    })

    if (files.length === 0) return done()
  }

  // do we have custom filter function?
  if (typeof options.filter === 'function') {
    const filteredFiles = options.filter(files)
    files = filterFiles(files, rejected, 'filter', file =>
      filteredFiles.includes(file)
    )
  }

  if (options.maxFiles !== void 0) {
    const maxFiles = Number.parseInt(options.maxFiles, 10)
    let filesNumber = append ? currentFileList.length : 0

    files = filterFiles(files, rejected, 'max-files', () => {
      filesNumber++
      return filesNumber <= maxFiles
    })
  }

  return done()
}

function stopAndPreventDrag(e) {
  if (e?.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }

  stopAndPrevent(e)
}

export const useFileProps = {
  multiple: Boolean,
  accept: String,
  capture: String,
  maxFileSize: [Number, String],
  maxTotalSize: [Number, String],
  maxFiles: [Number, String],
  filter: Function
}

export const useFileEmits = ['rejected']

export default function useFile({
  editable,
  dnd,
  getFileInput,
  addFilesToQueue
}) {
  const { props, emit, proxy } = getCurrentInstance()

  const dndRef = shallowRef(null)

  const maxFilesNumber = computed(() => Number.parseInt(props.maxFiles, 10))
  const maxTotalSizeNumber = computed(() =>
    Number.parseInt(props.maxTotalSize, 10)
  )

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

  function addFiles(files) {
    if (editable.value && files) {
      addFilesToQueue(null, files)
    }
  }

  function processFiles(e, filesToProcess, currentFileList, append) {
    const { files, rejected } = validateFiles(
      filesToProcess || e.target.files,
      props,
      currentFileList,
      append
    )

    if (rejected.length !== 0) {
      emit('rejected', rejected)
    }

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
