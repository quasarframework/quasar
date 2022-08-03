import { h, ref, onUnmounted, Teleport } from 'vue'

import { noop } from '../../utils/event.js'
import { addFocusWaitFlag, removeFocusWaitFlag } from '../../utils/private/focus-manager.js'
import { createGlobalNode, removeGlobalNode } from '../../utils/private/global-nodes.js'
import { portalList } from '../../utils/private/portal.js'

function isOnGlobalDialog (vm) {
  vm = vm.parent

  while (vm !== void 0 && vm !== null) {
    if (vm.type.name === 'QGlobalDialog') {
      return true
    }
    if (vm.type.name === 'QDialog' || vm.type.name === 'QMenu') {
      return false
    }

    vm = vm.parent
  }

  return false
}

// Warning!
// You MUST specify "inheritAttrs: false" in your component

export default function (vm, innerRef, renderPortalContent, checkGlobalDialog) {
  // showing, including while in show/hide transition
  const portalIsActive = ref(false)

  // showing & not in any show/hide transition
  const portalIsAccessible = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return {
      portalIsActive,
      portalIsAccessible,

      showPortal: noop,
      hidePortal: noop,
      renderPortal: noop
    }
  }

  let portalEl = null
  const focusObj = {}
  const onGlobalDialog = checkGlobalDialog === true && isOnGlobalDialog(vm)

  function showPortal (isReady) {
    if (isReady === true) {
      removeFocusWaitFlag(focusObj)
      portalIsAccessible.value = true
      return
    }

    portalIsAccessible.value = false

    if (portalIsActive.value === false) {
      if (onGlobalDialog === false && portalEl === null) {
        portalEl = createGlobalNode()
      }

      portalIsActive.value = true

      // register portal
      portalList.push(vm.proxy)

      addFocusWaitFlag(focusObj)
    }
  }

  function hidePortal (isReady) {
    portalIsAccessible.value = false

    if (isReady !== true) { return }

    removeFocusWaitFlag(focusObj)
    portalIsActive.value = false

    // unregister portal
    const index = portalList.indexOf(vm.proxy)
    if (index > -1) {
      portalList.splice(index, 1)
    }

    if (portalEl !== null) {
      removeGlobalNode(portalEl)
      portalEl = null
    }
  }

  onUnmounted(() => { hidePortal(true) })

  // expose publicly needed stuff for portal utils
  Object.assign(vm.proxy, { __qPortalInnerRef: innerRef })

  return {
    showPortal,
    hidePortal,

    portalIsActive,
    portalIsAccessible,

    renderPortal: () => (
      onGlobalDialog === true
        ? renderPortalContent()
        : (
            portalIsActive.value === true
              ? [ h(Teleport, { to: portalEl }, renderPortalContent()) ]
              : void 0
          )
    )
  }
}
