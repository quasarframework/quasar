import { getParentVm } from './vm.js'

export const portalList = []

export function getPortalVm (el) {
  return portalList.find(vm =>
    vm.__qPortalInnerRef.value !== null
    && vm.__qPortalInnerRef.value.contains(el)
  )
}

export function closePortalMenus (vm, evt) {
  do {
    if (vm.$options.name === 'QMenu') {
      vm.hide(evt)

      // is this a point of separation?
      if (vm.$props.separateClosePopup === true) {
        return getParentVm(vm)
      }
    }
    else if (vm.__qPortalInnerRef !== void 0) {
      // treat it as point of separation if parent is QPopupProxy
      // (so mobile matches desktop behavior)
      // and hide it too
      const parent = getParentVm(vm)

      if (parent !== void 0 && parent.$options.name === 'QPopupProxy') {
        vm.hide(evt)
        return parent
      }
      else {
        return vm
      }
    }

    vm = getParentVm(vm)
  } while (vm !== void 0 && vm !== null)
}

export function closePortals (vm, evt, depth) {
  while (depth !== 0 && vm !== void 0 && vm !== null) {
    if (vm.__qPortalInnerRef !== void 0) {
      depth--

      if (vm.$options.name === 'QMenu') {
        vm = closePortalMenus(vm, evt)
        continue
      }

      vm.hide(evt)
    }

    vm = getParentVm(vm)
  }
}
