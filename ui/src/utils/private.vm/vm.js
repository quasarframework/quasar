import { toValue } from 'vue'

// copied to docs too
export function getParentProxy(proxy) {
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

function fillNormalizedVNodes(list, vnodes, accept) {
  for (let i = 0; i < vnodes.length; i++) {
    const vnode = vnodes[i]

    if (typeof vnode.type === 'symbol') {
      // Fragment (v-for, <template>); Text/Comment carry no vnode children
      if (Array.isArray(vnode.children)) {
        fillNormalizedVNodes(list, vnode.children, accept)
      }
    } else if (accept === void 0 || accept(vnode)) {
      list.push(vnode)
    }
  }

  return list
}

/**
 * Flattens the vnodes of a rendered slot (Fragments unwrapped,
 * Text/Comment dropped) in a single pass; the optional `accept`
 * predicate filters while walking, so no intermediate list is built
 */
export function getNormalizedVNodes(vnodes, accept) {
  return fillNormalizedVNodes([], vnodes, accept)
}

export function vmHasRouter(vm) {
  return vm.appContext.config.globalProperties.$router !== void 0
}

export function vmIsDestroyed(vm) {
  return vm.isUnmounted === true || vm.isDeactivated === true
}

/**
 * Resolves the element a composable should watch: `target` (a ref or
 * getter of an Element or a component instance) or, when omitted, the
 * root element of the current component instance `vm`
 */
export function getTargetElement(target, vm) {
  const value =
    target === void 0 ? (vm === null ? null : vm.proxy.$el) : toValue(target)

  if (value === null || value === void 0) return null

  // a component ref resolves to its root element; a fragment root
  // (text/comment node) cannot be observed
  const el = value.$el ?? value
  return el.nodeType === 1 ? el : null
}
