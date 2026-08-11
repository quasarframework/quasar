import { Teleport, h, onUnmounted, ref } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { noop } from '../../utils/event/event.js'
import { portalProxyList } from '../../utils/private.portal/portal.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

import {
  addFocusWaitFlag,
  removeFocusWaitFlag
} from '../../utils/private.focus/focus-manager.js'

import {
  createGlobalNode,
  removeGlobalNode
} from '../../utils/private.config/nodes.js'

/**
 * Noop internal component to ease testing
 * of the teleported content.
 *
 * const wrapper = mount(QDialog, { ... })
 * const teleportedWrapper = wrapper.findComponent({ name: 'QPortal' })
 */
const QPortal = /*#__PURE__*/ createComponent({
  name: 'QPortal',
  setup(_, { slots }) {
    return () => slots.default()
  }
})

function isOnGlobalDialog(vm) {
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

// When anchored inside a dialog with aria-modal="true", assistive
// tech ignores anything rendered outside the dialog's element, so
// such portals must render within it to stay in the a11y tree
function getAriaModalEl(vm) {
  let node = vm.parent

  while (node !== void 0 && node !== null) {
    if (node.type.name === 'QDialog') {
      const el = node.proxy?.__getAriaModalEl?.()
      if (el !== null && el !== void 0) return el
    }

    node = node.parent
  }

  return null
}

// Warning!
// You MUST specify "inheritAttrs: false" in your component

export default function usePortal(vm, innerRef, renderPortalContent, type) {
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

  function showPortal(isReady) {
    if (isReady) {
      removeFocusWaitFlag(focusObj)
      portalIsAccessible.value = true
      return
    }

    portalIsAccessible.value = false

    if (!portalIsActive.value) {
      if (!onGlobalDialog && portalEl === null) {
        const modalEl = type === 'menu' ? getAriaModalEl(vm) : null

        portalEl = createGlobalNode(false, type, modalEl)

        if (modalEl !== null) {
          // the dialog's root element has no-pointer-events
          portalEl.classList.add('all-pointer-events')
        }
      }

      portalIsActive.value = true

      // register portal
      portalProxyList.push(vm.proxy)

      addFocusWaitFlag(focusObj)
    }
  }

  function hidePortal(isReady) {
    portalIsAccessible.value = false

    if (!isReady) return

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

  onUnmounted(() => {
    hidePortal(true)
  })

  // needed for portal vm detection
  vm.proxy.__qPortal = true

  // public way of accessing the rendered content
  injectProp(vm.proxy, 'contentEl', () => innerRef.value)

  return {
    showPortal,
    hidePortal,

    portalIsActive,
    portalIsAccessible,

    renderPortal: () =>
      onGlobalDialog
        ? renderPortalContent()
        : portalIsActive.value
          ? [h(Teleport, { to: portalEl }, h(QPortal, renderPortalContent))]
          : void 0
  }
}
