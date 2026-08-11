import { getCurrentInstance, onBeforeUpdate, ref } from 'vue'

const listenerRE = /^on[A-Z]/

export default function useSplitAttrs() {
  const vm = getCurrentInstance()
  const { attrs } = vm

  const acc = {
    listeners: ref({}),
    attributes: ref({})
  }

  function update() {
    const attributes = {}
    const listeners = {}

    for (const key in attrs) {
      if (key !== 'class' && key !== 'style' && !listenerRE.test(key)) {
        attributes[key] = attrs[key]
      }
    }

    for (const key in vm.vnode.props) {
      if (listenerRE.test(key)) {
        listeners[key] = vm.vnode.props[key]
      }
    }

    acc.attributes.value = attributes
    acc.listeners.value = listeners
  }

  onBeforeUpdate(update)

  update()

  return acc
}
