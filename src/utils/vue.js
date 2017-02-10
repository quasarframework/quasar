export function getParent (vm, prop) {
  if (!vm) {
    return false
  }

  return prop in vm ? vm : getParent(vm.$parent, prop)
}
