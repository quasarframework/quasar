import { listenOpts } from '../event.js'
import { portalProxyList } from '../private/portal.js'

let timer = null

const
  { notPassiveCapture } = listenOpts,
  registeredList = []

function globalHandler (evt) {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }

  const target = evt.target

  if (
    target === void 0
    || target.nodeType === 8
    || target.classList.contains('no-pointer-events') === true
  ) {
    return
  }

  // check last portal vm if it's
  // a QDialog and not in seamless mode
  let portalIndex = portalProxyList.length - 1

  while (portalIndex >= 0) {
    const proxy = portalProxyList[ portalIndex ].$

    // skip QTooltip portals
    if (proxy.type.name === 'QTooltip') {
      portalIndex--
      continue
    }

    if (proxy.type.name !== 'QDialog') {
      break
    }

    if (proxy.props.seamless !== true) {
      return
    }

    portalIndex--
  }

  for (let i = registeredList.length - 1; i >= 0; i--) {
    const state = registeredList[ i ]

    if (
      (
        state.anchorEl.value === null
        || state.anchorEl.value.contains(target) === false
      )
      && (
        target === document.body
        || (
          state.innerRef.value !== null
          && state.innerRef.value.contains(target) === false
        )
      )
    ) {
      // mark the event as being processed by clickOutside
      // used to prevent refocus after menu close
      evt.qClickOutside = true
      state.onClickOutside(evt)
    }
    else {
      return
    }
  }
}

export function addClickOutside (clickOutsideProps) {
  registeredList.push(clickOutsideProps)

  if (registeredList.length === 1) {
    document.addEventListener('mousedown', globalHandler, notPassiveCapture)
    document.addEventListener('touchstart', globalHandler, notPassiveCapture)
  }
}

export function removeClickOutside (clickOutsideProps) {
  const index = registeredList.findIndex(h => h === clickOutsideProps)

  if (index > -1) {
    registeredList.splice(index, 1)

    if (registeredList.length === 0) {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }

      document.removeEventListener('mousedown', globalHandler, notPassiveCapture)
      document.removeEventListener('touchstart', globalHandler, notPassiveCapture)
    }
  }
}
