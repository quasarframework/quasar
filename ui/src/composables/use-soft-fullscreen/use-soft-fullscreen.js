import {
  ReactiveEffect,
  getCurrentInstance,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  toValue,
  watch
} from 'vue'

import History from '../../plugins/private.history/History.js'
import {
  getTargetElement,
  vmHasRouter,
  vmIsDestroyed
} from '../../utils/private.vm/vm.js'
import {
  getHorizontalScrollPosition,
  getVerticalScrollPosition
} from '../../utils/scroll/scroll.js'
import {
  addDetachedFullscreen,
  removeDetachedFullscreen
} from '../../utils/private.focus/detached-fullscreen.js'
import { bringGlobalNodesToFront } from '../../utils/private.config/nodes.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      inFullscreen, setFullscreen, exitFullscreen, toggleFullscreen
 *    } = useSoftFullscreen(options)
 *
 * options - plain object, ref or getter of:
 *    target      - ref (or getter) of an Element or a component instance;
 *                  defaults to the root element of the current component
 *    fullscreen  - the requested state; the element enters or leaves
 *                  fullscreen whenever it changes (and re-enters when its
 *                  KeepAlive-cached component gets activated again)
 *    noRouteExit - keep the fullscreen state across route changes
 *
 * The element gets moved to <body> (a filler node holds its place) so that
 * it escapes any ancestor overflow, transform or stacking context; the
 * consumer styles it for the occasion (the `fullscreen` CSS class).
 */

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

export default function useSoftFullscreen(options) {
  const inFullscreen = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return {
      inFullscreen,
      setFullscreen: noop,
      exitFullscreen: noop,
      toggleFullscreen: noop
    }
  }

  const vm = getCurrentInstance()

  let target,
    // the element currently in fullscreen; read live by the detached
    // registry, so a swapped target is picked up on its next lookup
    el = null,
    fillerNode = null,
    historyEntry,
    noRouteExit = false,
    requested,
    // plain mirror of inFullscreen: setFullscreen() runs inside the
    // effect on a request change, and reading the ref there would make
    // the effect track its own output
    active = false,
    // the scroll restore scheduled after the last exit
    restoreToken = 0

  function getEl() {
    return el
  }

  function isDestroyed() {
    return vm !== null && vmIsDestroyed(vm)
  }

  function cancelRestore() {
    restoreToken++
  }

  function setFullscreen() {
    if (active || isDestroyed()) return

    const node = getTargetElement(target, vm)
    if (node === null) return

    cancelRestore()

    if (counter === 0) {
      restoreState = {
        left: getHorizontalScrollPosition(window),
        top: getVerticalScrollPosition(window),
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    el = node
    active = true
    inFullscreen.value = true

    if (fillerNode === null) {
      fillerNode = document.createElement('span')
    }

    const focusCapture = captureFocusWithin(el)

    el.replaceWith(fillerNode)
    document.body.append(el)

    // appending after the portal nodes would bury every open popup
    // (same z-index, later in DOM paints on top) -- restore their
    // paint order (#18513)
    bringGlobalNodesToFront()

    addDetachedFullscreen(fillerNode, getEl)

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

  function exitFullscreen() {
    if (!active) return

    if (historyEntry !== void 0) {
      History.remove(historyEntry)
      historyEntry = void 0
    }

    removeDetachedFullscreen(fillerNode)

    // the element is only put back where it came from while it still
    // lives in the DOM; a deactivated (KeepAlive) or removed one has
    // already been moved elsewhere by Vue
    if (el.isConnected) {
      const focusCapture = captureFocusWithin(el)

      fillerNode.replaceWith(el)
      restoreFocus(focusCapture)
    } else {
      fillerNode.remove()
    }

    const exitedEl = el

    active = false
    inFullscreen.value = false

    counter = Math.max(0, counter - 1)
    if (counter !== 0) return

    document.body.classList.remove('q-body--fullscreen-mixin')

    if (restoreState === null) return

    const { left, top, width, height } = restoreState
    restoreState = null

    if (isDestroyed()) return

    const token = ++restoreToken

    nextTick(() => {
      if (token !== restoreToken || counter !== 0 || isDestroyed()) return

      requestAnimationFrame(() => {
        if (token !== restoreToken || counter !== 0 || isDestroyed()) return

        if (window.innerWidth !== width || window.innerHeight !== height) {
          /**
           * If user has resized the window while in fullscreen mode,
           * we cannot restore the scroll position because it will be wrong.
           * So we just scroll the element into view instead,
           * which is the best we can do.
           */
          exitedEl.scrollIntoView()
        } else {
          window.scrollTo(left, top)
        }
      })
    })
  }

  function toggleFullscreen() {
    if (active) {
      exitFullscreen()
    } else {
      setFullscreen()
    }
  }

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the options (and a target ref) read
  const effect = new ReactiveEffect(() => {
    const opts = toValue(options) ?? {}

    target = opts.target
    noRouteExit = opts.noRouteExit === true

    // resolved on every run, so that a target ref stays tracked
    const newEl = getTargetElement(target, vm)
    const newRequested = opts.fullscreen === true
    const requestChanged = newRequested !== requested
    requested = newRequested

    if (active && newEl !== el) {
      // the element in fullscreen is no longer the target
      exitFullscreen()
      if (requested) setFullscreen()
    } else if (requestChanged && requested !== active) {
      if (requested) setFullscreen()
      else exitFullscreen()
    }
  })

  effect.scheduler = () => {
    effect.run()
  }

  if (vm !== null) {
    if (vmHasRouter(vm)) {
      watch(
        () => vm.proxy.$route.fullPath,
        () => {
          if (!noRouteExit) exitFullscreen()
        }
      )
    }

    // first run once the template refs and the root element exist
    onMounted(() => {
      effect.run()
    })

    onDeactivated(() => {
      cancelRestore()
      exitFullscreen()
    })
    onActivated(() => {
      if (requested) setFullscreen()
    })

    onBeforeUnmount(() => {
      cancelRestore()
      exitFullscreen()
    })
  } else {
    effect.run()
  }

  return {
    inFullscreen,
    setFullscreen,
    exitFullscreen,
    toggleFullscreen
  }
}
