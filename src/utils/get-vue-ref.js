export default function (vm, refName) {
  let parent = vm.$parent

  while (parent && (!parent.$refs || !parent.$refs[refName])) {
    parent = parent.$parent
  }

  if (parent) {
    return parent.$refs[refName]
  }
}
