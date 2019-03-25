export function getAllChildren (vm) {
  let children = vm.$children
  vm.$children.forEach(child => {
    if (child.$children.length > 0) {
      children = children.concat(getAllChildren(child))
    }
  })
  return children
}
