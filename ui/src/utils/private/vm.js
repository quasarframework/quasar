// copied to docs too
export function getParentProxy (proxy) {
  if (Object(proxy.$parent) === proxy.$parent) {
    return proxy.$parent
  }

  let { parent } = proxy.$

  while (Object(parent) === parent) {
    if (Object(parent.proxy) === parent.proxy) {
      return parent.proxy
    }

    parent = parent.parent
  }
}

function fillNormalizedVNodes (children, vnode) {
  if (typeof vnode.type === 'symbol') {
    if (Array.isArray(vnode.children) === true) {
      vnode.children.forEach(child => {
        fillNormalizedVNodes(children, child)
      })
    }
  }
  else {
    children.add(vnode)
  }
}

// vnodes from rendered in advanced slots
export function getNormalizedVNodes (vnodes) {
  const children = new Set()

  vnodes.forEach(vnode => {
    fillNormalizedVNodes(children, vnode)
  })

  return Array.from(children)
}

export function vmHasRouter (vm) {
  return vm.appContext.config.globalProperties.$router !== void 0
}

export function vmIsDestroyed (vm) {
  return vm.isUnmounted === true || vm.isDeactivated === true
}
