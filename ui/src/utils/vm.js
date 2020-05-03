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
