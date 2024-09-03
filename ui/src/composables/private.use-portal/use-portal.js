import { h, ref, onUnmounted, Teleport } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { noop } from '../../utils/event/event.js'
import { addFocusWaitFlag, removeFocusWaitFlag } from '../../utils/private.focus/focus-manager.js'
import { createGlobalNode, removeGlobalNode } from '../../utils/private.config/nodes.js'
import { portalProxyList } from '../../utils/private.portal/portal.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

/**
 * Noop internal component to ease testing
 * of the teleported content.
 *
 * const wrapper = mount(QDialog, { ... })
 * const teleportedWrapper = wrapper.findComponent({ name: 'QPortal' })
 */
const QPortal = createComponent({
  name: 'QPortal',
  setup (_, { slots }) {
    return () => slots.default()
  }
})

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

export default function (vm, innerRef, renderPortalContent, type) {
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
  const onGlobalDialog = type === 'dialog' && isOnGlobalDialog(vm)

  function showPortal (isReady) {
    if (isReady === true) {
      removeFocusWaitFlag(focusObj)
      portalIsAccessible.value = true
      return
    }

    portalIsAccessible.value = false

    if (portalIsActive.value === false) {
      if (onGlobalDialog === false && portalEl === null) {
        portalEl = createGlobalNode(false, type)
      }

      portalIsActive.value = true

      // register portal
      portalProxyList.push(vm.proxy)

      addFocusWaitFlag(focusObj)
    }
  }

  function hidePortal (isReady) {
    portalIsAccessible.value = false

    if (isReady !== true) return

    removeFocusWaitFlag(focusObj)
    portalIsActive.value = false

    // unregister portal
    const index = portalProxyList.indexOf(vm.proxy)
    if (index !== -1) {
      portalProxyList.splice(index, 1)
    }

    if (portalEl !== null) {
      removeGlobalNode(portalEl)
      portalEl = null
    }
  }

  onUnmounted(() => { hidePortal(true) })

  // needed for portal vm detection
  vm.proxy.__qPortal = true

  // public way of accessing the rendered content
  injectProp(vm.proxy, 'contentEl', () => innerRef.value)

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
              ? [ h(Teleport, { to: portalEl }, h(QPortal, renderPortalContent)) ]
              : void 0
          )
    )
  }
}
