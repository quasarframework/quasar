import { getCurrentInstance, onBeforeUpdate, ref } from 'vue'

// the /^on[A-Z]/ test, allocation-free
function isListener(key) {
  if (key.codePointAt(0) !== 111 || key.codePointAt(1) !== 110) {
    return false // o n
  }
  const c = key.codePointAt(2)
  return c >= 65 && c <= 90 // A-Z
}

function differs(next, prev) {
  const keys = Object.keys(next)
  if (keys.length !== Object.keys(prev).length) return true
  for (const key of keys) {
    if (next[key] !== prev[key] || !(key in prev)) return true
  }
  return false
}

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
      if (key !== 'class' && key !== 'style' && !isListener(key)) {
        attributes[key] = attrs[key]
      }
    }

    for (const key in vm.vnode.props) {
      if (isListener(key)) {
        listeners[key] = vm.vnode.props[key]
      }
    }

    // update() runs on EVERY re-render of the consuming component while
    // attrs rarely change; keeping the previous object when the content
    // is identical spares every downstream computed that spreads it
    if (differs(attributes, acc.attributes.value)) {
      acc.attributes.value = attributes
    }

    if (differs(listeners, acc.listeners.value)) {
      acc.listeners.value = listeners
    }
  }

  onBeforeUpdate(update)

  update()

  return acc
}
