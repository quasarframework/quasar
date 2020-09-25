export function getVmOfNode (el) {
  for (let node = el; node !== null; node = node.parentNode) {
    if (node.__vueParentComponent !== void 0 && node.__vueParentComponent.proxy !== void 0) {
      return node.__vueParentComponent.proxy
    }
  }
}

export function isVmChildOf (childVm, parentVm) {
  for (let vm = childVm; vm !== void 0 && vm !== null; vm = vm.$parent) {
    if (vm === parentVm) {
      return true
    }
  }
  return false
}

export function getAppVm (VueApp) {
  return VueApp._container._vnode.component.ctx
}