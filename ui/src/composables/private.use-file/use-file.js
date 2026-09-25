import { getCurrentInstance, h } from 'vue'

import useDropZone from '../use-drop-zone/use-drop-zone.js'
import { stop } from '../../utils/event/event.js'
import { validateFiles } from './validate-files.js'

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

/*
 * editable        - ref; the file input can be opened
 * dropTarget      - ref of the element that accepts dropped files
 * canDrop         - ref; the drop zone is armed
 * getFileInput    - fn returning the native file input
 * addFilesToQueue - fn(evt, files) receiving the raw dropped files; the
 *                   queue runs the validation (append-aware, emits "rejected")
 */
export default function useFile({
  editable,
  dropTarget,
  canDrop,
  getFileInput,
  addFilesToQueue
}) {
  const { props, emit, proxy } = getCurrentInstance()

  const { isOverDropZone: dnd } = useDropZone(() => ({
    target: dropTarget,
    disabled: !canDrop.value,
    multiple: true,
    onDrop(files) {
      if (files.length !== 0) {
        addFilesToQueue(null, files)
      }
    }
  }))

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

  function getDndNode(type) {
    if (dnd.value) {
      return h('div', { class: `q-${type}__dnd absolute-full` })
    }
  }

  // expose public methods
  Object.assign(proxy, { pickFiles, addFiles })

  return {
    pickFiles,
    addFiles,
    dnd,
    processFiles,
    getDndNode
  }
}
