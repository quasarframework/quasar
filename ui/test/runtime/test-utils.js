/**
 * Wrapper over @vue/test-utils (the "@vue/test-utils" import
 * is aliased to this file in vitest.config.js).
 *
 * A real browser only computes styles and layout for elements that are
 * connected to the document, so mount()/shallowMount() attach the component
 * to a container in <body> by default. An explicit "attachTo" option
 * still takes precedence.
 */

import {
  mount as vtuMount,
  shallowMount as vtuShallowMount
} from '../../node_modules/@vue/test-utils/dist/vue-test-utils.esm-bundler.mjs'

export * from '../../node_modules/@vue/test-utils/dist/vue-test-utils.esm-bundler.mjs'

const containers = new Set()

function attachedMount(mountFn, component, options) {
  if (options?.attachTo !== void 0) {
    return mountFn(component, options)
  }

  const container = document.createElement('div')
  document.body.append(container)
  containers.add(container)

  return mountFn(component, { ...options, attachTo: container })
}

export function mount(component, options) {
  return attachedMount(vtuMount, component, options)
}

export function shallowMount(component, options) {
  return attachedMount(vtuShallowMount, component, options)
}

// called from vitest.setup.js after each test
export function removeMountContainers() {
  containers.forEach(container => {
    container.remove()
  })
  containers.clear()
}
