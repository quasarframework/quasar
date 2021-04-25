import { listenOpts } from '../event.js'

let timer

const
  { notPassiveCapture } = listenOpts,
  registeredList = []

function hasModalsAbove (node) {
  while ((node = node.nextElementSibling) !== null) {
    if (node.classList.contains('q-dialog--modal')) {
      return true
    }
  }

  return false
}

function globalHandler (evt) {
  clearTimeout(timer)

  const target = evt.target

  if (
    target === void 0
    || target.nodeType === 8
    || target.classList.contains('no-pointer-events') === true
  ) {
    return
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
        || (state.innerRef.value  !== null && state.innerRef.value.contains(target) === false)
      )
      && (
        state.getEl !== void 0
          ? hasModalsAbove(state.getEl()) !== true
          : true
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
      clearTimeout(timer)
      document.removeEventListener('mousedown', globalHandler, notPassiveCapture)
      document.removeEventListener('touchstart', globalHandler, notPassiveCapture)
    }
  }
}
