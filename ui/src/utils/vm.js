export function getVmOfNode (el) {
  for (let node = el; node !== null; node = node.parentNode) {
    if (node.__vueParentComponent !== void 0 && node.__vueParentComponent.proxy !== void 0) {
      return node.__vueParentComponent.proxy
    }
  }
}

export function getParentVm (vm) {
  if (vm.$parent !== void 0 && vm.$parent !== null) {
    return vm.$parent
  }

  vm = vm.$.parent

  while (vm !== void 0 && vm !== null) {
    if (vm.proxy !== void 0 && vm.proxy !== null) {
      return vm.proxy
    }

    vm = vm.parent
  }
}

export function getAppVm (VueApp) {
  return VueApp._container._vnode.component.ctx
}
