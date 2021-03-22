// used directly by docs too
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

// vnodes from rendered in advanced slots
export function getNormalizedVNodes (vnodes) {
  const children = new Set()

  vnodes.forEach(vnode => {
    if (typeof vnode.type === 'symbol' && Array.isArray(vnode.children) === true) {
      vnode.children.forEach(child => {
        children.add(child)
      })
    }
    else {
      children.add(vnode)
    }
  })

  return Array.from(children)
}

export function vmHasRouter (vm) {
  return vm.appContext.config.globalProperties.$router !== void 0
}
