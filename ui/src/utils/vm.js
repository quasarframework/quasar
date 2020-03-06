import { isSSR } from '../plugins/Platform.js'

function fillOrderedChildren (vm, children, ordMap) {
  vm.$children
    .slice()
    .sort((vm1, vm2) => ordMap.get(vm1.$el) <= ordMap.get(vm2.$el) ? -1 : 1)
    .forEach(function (child) {
      children.push(child)
      child.$children.length > 0 && fillOrderedChildren(child, children, ordMap)
    })
}

function fillUnorderedChildren (vm, children) {
  vm.$children
    .forEach(function (child) {
      children.push(child)
      child.$children.length > 0 && fillUnorderedChildren(child, children)
    })
}

export function getAllChildren (vm, ordered) {
  const children = []
  if (ordered === true && vm.$el !== void 0) {
    const ordMap = new WeakMap()
    Array.prototype.forEach.call(vm.$el.querySelectorAll('*'), WeakMap.prototype.set.bind(ordMap))
    fillOrderedChildren(vm, children, ordMap)
  }
  else {
    fillUnorderedChildren(vm, children)
  }
  return children
}

export function getVmOfNode (el) {
  for (let node = el; node !== null; node = node.parentNode) {
    // node.__vue__ can be null if the instance was destroyed
    if (node.__vue__ === null) {
      return
    }
    if (node.__vue__ !== void 0) {
      return node.__vue__
    }
  }
}

export function isVmChildOf (childVm, parentVm) {
  for (let vm = childVm; vm !== void 0; vm = vm.$parent) {
    if (vm === parentVm) {
      return true
    }
  }
  return false
}

export function cache (vm, key, obj) {
  if (isSSR === true) return obj

  const k = `__qcache_${key}`
  return vm[k] === void 0
    ? (vm[k] = obj)
    : vm[k]
}
