// used directly by docs too
export function getParentVm (vm) {
  if (Object(vm.$parent) === vm.$parent) {
    return vm.$parent
  }

  vm = vm.$.parent

  while (Object(vm) === vm) {
    if (Object(vm.proxy) === vm.proxy) {
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
