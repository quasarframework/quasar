import {
  getCurrentInstance,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  watch
} from 'vue'

import History from '../../plugins/private.history/History.js'
import { vmHasRouter, vmIsDestroyed } from '../../utils/private.vm/vm.js'
import useTick from '../use-tick/use-tick.js'
import useAnimationFrame from '../use-animation-frame/use-animation-frame.js'
import {
  getHorizontalScrollPosition,
  getVerticalScrollPosition
} from '../../utils/scroll/scroll.js'
import {
  addDetachedFullscreen,
  removeDetachedFullscreen
} from '../../utils/private.focus/detached-fullscreen.js'
import { bringGlobalNodesToFront } from '../../utils/private.config/nodes.js'

let counter = 0
let restoreState = null

/**
 * Detaching an element drops the focus (and any caret) it holds, and
 * browsers do not bring either back on re-insertion (#17843). Captured
 * before a move, restored after it.
 *
 * The caret/selection of an input or textarea is element state and comes
 * back with focus() on its own; a contenteditable caret lives on the
 * document Selection, which is captured as plain boundary values -- node
 * removal re-targets live Range objects to the old parent.
 */
function captureFocusWithin(el) {
  const activeEl = document.activeElement

  if (
    activeEl === null ||
    activeEl === document.body ||
    !el.contains(activeEl)
  ) {
    return null
  }

  const capture = { activeEl }

  if (activeEl.isContentEditable === true) {
    const selection = document.getSelection()

    if (selection.rangeCount !== 0 && el.contains(selection.anchorNode)) {
      capture.anchorNode = selection.anchorNode
      capture.anchorOffset = selection.anchorOffset
      capture.focusNode = selection.focusNode
      capture.focusOffset = selection.focusOffset
    }
  }

  return capture
}

function restoreFocus(capture) {
  if (capture === null || !capture.activeEl.isConnected) return

  capture.activeEl.focus({ preventScroll: true })

  if (capture.anchorNode !== void 0 && capture.anchorNode.isConnected) {
    document
      .getSelection()
      .setBaseAndExtent(
        capture.anchorNode,
        capture.anchorOffset,
        capture.focusNode,
        capture.focusOffset
      )
  }
}

export const useFullscreenProps = {
  fullscreen: Boolean,
  noRouteFullscreenExit: Boolean
}

export const useFullscreenEmits = ['update:fullscreen', 'fullscreen']

export default function useFullscreen() {
  const vm = getCurrentInstance()
  const { props, emit, proxy } = vm

  let historyEntry, fullscreenFillerNode

  const inFullscreen = ref(false)
  const { registerTick, removeTick } = useTick()
  const { registerAnimationFrame, removeAnimationFrame } = useAnimationFrame()

  if (vmHasRouter(vm)) {
    watch(
      () => proxy.$route.fullPath,
      () => {
        if (!props.noRouteFullscreenExit) exitFullscreen()
      }
    )
  }

  watch(
    () => props.fullscreen,
    v => {
      if (inFullscreen.value !== v) toggleFullscreen()
    }
  )

  watch(inFullscreen, v => {
    emit('update:fullscreen', v)
    emit('fullscreen', v)
  })

  function toggleFullscreen() {
    if (inFullscreen.value) {
      exitFullscreen()
    } else {
      setFullscreen()
    }
  }

  function setFullscreen() {
    if (vmIsDestroyed(vm) || inFullscreen.value) return

    removeAnimationFrame()
    removeTick()

    if (counter === 0) {
      restoreState = {
        left: getHorizontalScrollPosition(window),
        top: getVerticalScrollPosition(window),
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    inFullscreen.value = true

    const focusCapture = captureFocusWithin(proxy.$el)

    proxy.$el.replaceWith(fullscreenFillerNode)
    document.body.append(proxy.$el)

    // appending after the portal nodes would bury every open popup
    // (same z-index, later in DOM paints on top) -- restore their
    // paint order (#18513)
    bringGlobalNodesToFront()

    addDetachedFullscreen(fullscreenFillerNode, proxy)

    // after the registry entry, so that a focus trap watching focusin
    // (QDialog) already resolves the detached element as logically owned
    restoreFocus(focusCapture)

    counter++
    if (counter === 1) {
      document.body.classList.add('q-body--fullscreen-mixin')
    }

    historyEntry = {
      handler: exitFullscreen
    }
    History.add(historyEntry)
  }

  function exitFullscreenImpl(shouldRestoreElement) {
    if (!inFullscreen.value) return

    if (historyEntry !== void 0) {
      History.remove(historyEntry)
      historyEntry = void 0
    }

    removeDetachedFullscreen(fullscreenFillerNode)

    if (shouldRestoreElement === true) {
      const focusCapture = captureFocusWithin(proxy.$el)

      fullscreenFillerNode.replaceWith(proxy.$el)
      restoreFocus(focusCapture)
    } else {
      // the element is headed for a KeepAlive storage container;
      // focus cannot follow it out of the live DOM
      fullscreenFillerNode.remove()
    }

    inFullscreen.value = false

    counter = Math.max(0, counter - 1)
    if (counter !== 0) return

    document.body.classList.remove('q-body--fullscreen-mixin')

    if (restoreState === null) return

    const { left, top, width, height } = restoreState
    restoreState = null

    if (vmIsDestroyed(vm)) return

    registerTick(() => {
      if (counter !== 0) return
      registerAnimationFrame(() => {
        if (counter !== 0) return

        if (window.innerWidth !== width || window.innerHeight !== height) {
          /**
           * If user has resized the window while in fullscreen mode,
           * we cannot restore the scroll position because it will be wrong.
           * So we just scroll the element into view instead,
           * which is the best we can do.
           */
          proxy.$el.scrollIntoView()
        } else {
          window.scrollTo(left, top)
        }
      })
    })
  }

  function exitFullscreen() {
    exitFullscreenImpl(true)
  }

  onBeforeMount(() => {
    fullscreenFillerNode = document.createElement('span')
  })

  onMounted(() => {
    if (props.fullscreen) setFullscreen()
  })

  onDeactivated(() => {
    // A direct child of KeepAlive has already been moved to its storage
    // container at this point. Its filler must not move it back into the DOM.
    exitFullscreenImpl(proxy.$el.isConnected)
  })
  onActivated(() => {
    if (props.fullscreen) setFullscreen()
  })
  onBeforeUnmount(exitFullscreen)

  // expose public methods
  Object.assign(proxy, {
    toggleFullscreen,
    setFullscreen,
    exitFullscreen
  })

  return {
    inFullscreen,
    toggleFullscreen
  }
}
