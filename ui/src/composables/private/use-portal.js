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
  const portalIsActive = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return {
      portalIsActive,

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
      return
    }

    if (onGlobalDialog === false && portalEl === null) {
      portalEl = createGlobalNode()
    }

    portalIsActive.value = true

    // register portal
    portalList.push(vm.proxy)

    addFocusWaitFlag(focusObj)
  }

  function hidePortal () {
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

  onUnmounted(hidePortal)

  // expose publicly needed stuff for portal utils
  Object.assign(vm.proxy, { __qPortalInnerRef: innerRef })

  return {
    showPortal,
    hidePortal,

    portalIsActive,

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
