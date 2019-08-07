import Vue from 'vue'

let inject

function fillInject (root) {
  const
    options = (new Vue()).$root.$options,
    skip = [ 'el', 'methods', 'render', 'mixins' ]
      .concat(Vue.config._lifecycleHooks)
      .concat(Object.keys(options).filter(key => options[key] !== null))

  inject = {}

  Object.keys(root)
    .filter(name => skip.includes(name) === false)
    .forEach(p => {
      inject[p] = root[p]
    })
}

export function getVm (root, vm) {
  inject === void 0 && root !== void 0 && fillInject(root.$root.$options)
  return new Vue(inject !== void 0 ? { ...inject, ...vm } : vm)
}

export function getAllChildren (vm, children = []) {
  vm.$children.forEach(function (child) {
    children.push(child)
    child.$children.length > 0 && getAllChildren(child, children)
  })
  return children
}
