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
