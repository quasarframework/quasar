import { getParentProxy } from '../private.vm/vm.js'

export const portalProxyList = []

export function getPortalProxy (el) {
  return portalProxyList.find(proxy =>
    proxy.contentEl !== null
    && proxy.contentEl.contains(el)
  )
}

export function closePortalMenus (proxy, evt) {
  do {
    if (proxy.$options.name === 'QMenu') {
      proxy.hide(evt)

      // is this a point of separation?
      if (proxy.$props.separateClosePopup === true) {
        return getParentProxy(proxy)
      }
    }
    else if (proxy.__qPortal === true) {
      // treat it as point of separation if parent is QPopupProxy
      // (so mobile matches desktop behavior)
      // and hide it too
      const parent = getParentProxy(proxy)

      if (parent !== void 0 && parent.$options.name === 'QPopupProxy') {
        proxy.hide(evt)
        return parent
      }
      else {
        return proxy
      }
    }

    proxy = getParentProxy(proxy)
  } while (proxy !== void 0 && proxy !== null)
}

export function closePortals (proxy, evt, depth) {
  while (depth !== 0 && proxy !== void 0 && proxy !== null) {
    if (proxy.__qPortal === true) {
      depth--

      if (proxy.$options.name === 'QMenu') {
        proxy = closePortalMenus(proxy, evt)
        continue
      }

      proxy.hide(evt)
    }

    proxy = getParentProxy(proxy)
  }
}
