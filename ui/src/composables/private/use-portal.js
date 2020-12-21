import { h, ref, onUnmounted, Teleport } from 'vue'

import { createGlobalNode, removeGlobalNode } from '../../utils/global-nodes.js'
import { portalList } from '../../utils/portal.js'

// Warning!
// 1. You MUST specify "inheritAttrs: false" in your component
// 2. Also expose publicly:
// Object.assign(vm.proxy, {
//   expose needed stuff for portal utils
//   quasarPortalInnerRef: innerRef
// })
// })

export default function (vm, renderPortalContent) {
  if (__QUASAR_SSR_SERVER__) {
    // TODO vue3
    return
  }

  let portalEl = null
  const onGlobalDialog = vm.proxy.$root.$.type.name === 'QGlobalDialog'

  const portalIsActive = ref(false)

  function showPortal () {
    if (onGlobalDialog === false) {
      portalEl = createGlobalNode()
    }

    portalIsActive.value = true

    // register portal
    portalList.push(vm.proxy)
  }

  function hidePortal () {
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

  return {
    showPortal,
    hidePortal,

    portalIsActive,

    renderPortal: () => onGlobalDialog === true
      ? renderPortalContent()
      : (
          portalIsActive.value === true
            ? [h(Teleport, { to: portalEl }, renderPortalContent())]
            : void 0
        )
  }
}
