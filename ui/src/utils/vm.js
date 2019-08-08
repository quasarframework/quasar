import Vue from 'vue'

let
  inject = {},
  skip

function fillInject (rootOptions) {
  if (skip === void 0) {
    const options = (new Vue()).$root.$options

    skip = ['el', 'methods', 'render', 'mixins']
      .concat(Vue.config._lifecycleHooks)
      .concat(Object.keys(options).filter(key => options[key] !== null))
  }

  inject[rootOptions] = Object.keys(rootOptions)
    .filter(name => skip.indexOf(name) === -1)
    .reduce((acc, p) => {
      acc[p] = rootOptions[p]
    }, {})
}

export function getVm (root, vm) {
  if (root !== void 0) {
    const rootOptions = root.$options
    inject[rootOptions] === void 0 && fillInject(rootOptions)

    return new Vue({ ...inject[rootOptions], ...vm })
  }

  return new Vue(vm)
}

export function getAllChildren (vm, children = []) {
  vm.$children.forEach(function (child) {
    children.push(child)
    child.$children.length > 0 && getAllChildren(child, children)
  })
  return children
}
