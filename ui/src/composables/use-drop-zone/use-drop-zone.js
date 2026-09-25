import {
  ReactiveEffect,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue
} from 'vue'

import { client } from '../../plugins/platform/Platform.js'
import { getTargetElement } from '../../utils/private.vm/vm.js'
import { noop, stopAndPrevent } from '../../utils/event/event.js'
import { validateFiles } from '../private.use-file/validate-files.js'

/*
 * Usage:
 *    const {
 *      isOverDropZone, droppedFiles, rejectedFiles, resetDropZone, stop
 *    } = useDropZone(options)
 *
 * options - plain object, ref or getter of (all optional):
 *    target   - ref (or getter) of an Element or a component instance;
 *               defaults to the root element of the current component
 *    disabled - stop accepting drops (the browser's default applies again)
 *    multiple, accept, maxFileSize, maxTotalSize, maxFiles, filter -
 *               validation, same meaning as the QFile/QUploader props
 *    onDrop     - called with the accepted File[] and the drop Event
 *    onRejected - called with the { failedPropValidation, file } entries
 *    onEnter    - called with the Event when a drag enters the zone
 *    onLeave    - called with the Event when it leaves it or gets dropped
 */

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

export default function useDropZone(options) {
  const isOverDropZone = ref(false)
  const droppedFiles = shallowRef([])
  const rejectedFiles = shallowRef([])

  function resetDropZone() {
    droppedFiles.value = []
    rejectedFiles.value = []
  }

  if (__QUASAR_SSR_SERVER__) {
    return {
      isOverDropZone,
      droppedFiles,
      rejectedFiles,
      resetDropZone,
      stop: noop
    }
  }

  const vm = getCurrentInstance()

  let el = null,
    // the element released by stop(); the zone stays inert until the
    // target points elsewhere
    stoppedEl = null

  function getOptions() {
    return toValue(options) ?? {}
  }

  function setOver(status, evt) {
    if (isOverDropZone.value === status) return

    isOverDropZone.value = status
    getOptions()[status ? 'onEnter' : 'onLeave']?.(evt)
  }

  function onDragenter(evt) {
    stopAndPrevent(evt)
    setOver(true, evt)
  }

  function onDragover(evt) {
    evt.dataTransfer.dropEffect = 'copy'
    stopAndPrevent(evt)
    setOver(true, evt)
  }

  function onDragleave(evt) {
    stopAndPrevent(evt)

    // dragleave fires when moving between the zone's own children too;
    // the drag is still over the zone when the element being entered
    // (relatedTarget) is inside it -- Safari reports null there
    // (https://bugs.webkit.org/show_bug.cgi?id=66547), so it gets asked
    // what lies under the pointer instead
    const stillOver =
      evt.relatedTarget !== null || !client.is.safari
        ? el.contains(evt.relatedTarget)
        : document.elementsFromPoint(evt.clientX, evt.clientY).includes(el)

    if (!stillOver) {
      setOver(false, evt)
    }
  }

  function onDrop(evt) {
    stopAndPrevent(evt)
    setOver(false, evt)

    const opts = getOptions()
    const { files, rejected } = validateFiles(evt.dataTransfer.files, opts)

    rejectedFiles.value = rejected

    if (rejected.length !== 0) {
      opts.onRejected?.(rejected)
    }

    if (files.length !== 0) {
      droppedFiles.value = files
    }

    opts.onDrop?.(files, evt)
  }

  const handlers = [onDragenter, onDragover, onDragleave, onDrop]

  function release() {
    if (el !== null) {
      events.forEach((name, index) => {
        el.removeEventListener(name, handlers[index])
      })
      el = null
    }

    isOverDropZone.value = false
  }

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the options (and a target ref) read
  const effect = new ReactiveEffect(() => {
    const opts = getOptions()
    const newEl = getTargetElement(opts.target, vm)

    if (opts.disabled === true || newEl === null || newEl === stoppedEl) {
      release()
      return
    }

    stoppedEl = null

    if (newEl === el) return

    release()
    el = newEl

    events.forEach((name, index) => {
      el.addEventListener(name, handlers[index])
    })
  })

  effect.scheduler = () => {
    effect.run()
  }

  if (vm !== null) {
    // first run once the template refs and the root element exist
    onMounted(() => {
      effect.run()
    })
    onBeforeUnmount(() => {
      release()
      effect.stop()
    })
  } else {
    effect.run()
  }

  return {
    isOverDropZone,
    droppedFiles,
    rejectedFiles,
    resetDropZone,

    // releases the current target; another target re-arms the zone
    stop() {
      stoppedEl = el
      release()
    }
  }
}
