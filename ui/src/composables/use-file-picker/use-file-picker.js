import { getCurrentInstance, onBeforeUnmount, shallowRef, toValue } from 'vue'

import { validateFiles } from '../private.use-file/use-file.js'

/*
 * Usage:
 *    const {
 *      pickedFiles, rejectedFiles, openFilePicker, resetFilePicker
 *    } = useFilePicker(options)
 *
 * options - plain object, ref or getter of (all optional):
 *    multiple, accept, capture, directory - the native file input settings
 *    maxFileSize, maxTotalSize, maxFiles, filter - validation, same
 *               meaning as the QFile/QUploader props
 *    onChange   - called with the accepted File[] after a selection
 *    onRejected - called with the { failedPropValidation, file } entries
 *    onCancel   - called when the dialog is dismissed
 *
 * openFilePicker(overrides) must run as a direct consequence of a user interaction
 * (a click handler); it returns a Promise of the accepted File[] (empty
 * when everything got rejected) or null when the dialog was dismissed.
 */

export default function useFilePicker(options) {
  const pickedFiles = shallowRef([])
  const rejectedFiles = shallowRef([])

  function resetFilePicker() {
    pickedFiles.value = []
    rejectedFiles.value = []
  }

  if (__QUASAR_SSR_SERVER__) {
    return {
      pickedFiles,
      rejectedFiles,
      openFilePicker: () => Promise.resolve(null),
      resetFilePicker
    }
  }

  let input = null,
    // { opts, resolve } of the selection in progress
    pending = null

  function settle(result) {
    if (pending === null) return

    const { resolve } = pending
    pending = null
    resolve(result)
  }

  function onChange() {
    const opts = pending?.opts ?? toValue(options) ?? {}
    const result = validateFiles(input.files, {
      ...opts,
      // a folder pick is a multi-file pick by nature
      multiple: opts.multiple === true || opts.directory === true
    })

    // let the same file be picked again next time (Safari fires
    // @change in a loop otherwise)
    input.value = ''

    rejectedFiles.value = result.rejected

    if (result.rejected.length !== 0) {
      opts.onRejected?.(result.rejected)
    }

    if (result.files.length !== 0) {
      pickedFiles.value = result.files
      opts.onChange?.(result.files)
    }

    settle(result.files)
  }

  function onCancel() {
    const opts = pending?.opts ?? toValue(options) ?? {}

    // no selection took place, so nothing to reset on the input
    opts.onCancel?.()
    settle(null)
  }

  function getInput() {
    if (input === null) {
      input = document.createElement('input')
      input.type = 'file'
      input.addEventListener('change', onChange)
      input.addEventListener('cancel', onCancel)
    }

    return input
  }

  function openFilePicker(overrides) {
    const opts = { ...toValue(options), ...overrides }
    const el = getInput()

    el.multiple = opts.multiple === true
    el.webkitdirectory = opts.directory === true
    el.accept = opts.accept ?? ''

    if (opts.capture !== void 0) {
      el.setAttribute('capture', opts.capture)
    } else {
      el.removeAttribute('capture')
    }

    // a dialog still awaited from a previous openFilePicker() will never report
    settle(null)

    return new Promise(resolve => {
      pending = { opts, resolve }
      el.click()
    })
  }

  if (getCurrentInstance() !== null) {
    onBeforeUnmount(() => {
      settle(null)

      if (input !== null) {
        input.removeEventListener('change', onChange)
        input.removeEventListener('cancel', onCancel)
        input = null
      }
    })
  }

  return { pickedFiles, rejectedFiles, openFilePicker, resetFilePicker }
}
