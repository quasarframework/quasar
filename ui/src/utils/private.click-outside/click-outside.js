import { listenOpts } from '../event/event.js'
import { portalProxyList } from '../private.portal/portal.js'

let timer = null

const { notPassiveCapture } = listenOpts,
  registeredList = []

function globalHandler(evt) {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }

  const target = evt.target

  if (
    target === void 0 ||
    target.nodeType === 8 ||
    target.classList.contains('no-pointer-events')
  ) {
    return
  }

  // a modal (non-seamless) QDialog shields popups opened before it,
  // so only popups opened after it can be closed by this click (#18091)
  let closableContentEls = null
  let sawClosablePortal = false

  for (let i = portalProxyList.length - 1; i >= 0; i--) {
    const proxy = portalProxyList[i].$
    const name = proxy.type.name

    // skip QTooltip portals
    if (name === 'QTooltip') {
      continue
    }

    if (name === 'QDialog') {
      if (proxy.props.seamless !== true) {
        if (sawClosablePortal === false) return

        closableContentEls = new Set(
          portalProxyList.slice(i + 1).map(vm => vm.contentEl)
        )
        break
      }

      continue
    }

    sawClosablePortal = true
  }

  for (let i = registeredList.length - 1; i >= 0; i--) {
    const state = registeredList[i]

    if (
      closableContentEls !== null &&
      !closableContentEls.has(state.innerRef.value)
    ) {
      return
    }

    if (
      (state.anchorEl.value === null ||
        !state.anchorEl.value.contains(target)) &&
      (target === document.body ||
        (state.innerRef.value !== null &&
          !state.innerRef.value.contains(target)))
    ) {
      // mark the event as being processed by clickOutside
      // used to prevent refocus after menu close
      evt.qClickOutside = true
      state.onClickOutside(evt)
    } else {
      return
    }
  }
}

export function addClickOutside(clickOutsideProps) {
  registeredList.push(clickOutsideProps)

  if (registeredList.length === 1) {
    document.addEventListener('mousedown', globalHandler, notPassiveCapture)
    document.addEventListener('touchstart', globalHandler, notPassiveCapture)
  }
}

export function removeClickOutside(clickOutsideProps) {
  const index = registeredList.indexOf(clickOutsideProps)

  if (index !== -1) {
    registeredList.splice(index, 1)

    if (registeredList.length === 0) {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }

      document.removeEventListener(
        'mousedown',
        globalHandler,
        notPassiveCapture
      )
      document.removeEventListener(
        'touchstart',
        globalHandler,
        notPassiveCapture
      )
    }
  }
}
