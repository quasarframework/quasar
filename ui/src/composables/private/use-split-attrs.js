import { ref, onBeforeUpdate } from 'vue'

const listenerRE = /^on[A-Z]/

export default function (attrs, vnode) {
  const acc = {
    listeners: ref({}),
    attributes: ref({})
  }

  function update () {
    const attributes = {}
    const listeners = {}

    for (const key in attrs) {
      if (key !== 'class' && key !== 'style' && listenerRE.test(key) === false) {
        attributes[ key ] = attrs[ key ]
      }
    }

    for (const key in vnode.props) {
      if (listenerRE.test(key) === true) {
        listeners[ key ] = vnode.props[ key ]
      }
    }

    acc.attributes.value = attributes
    acc.listeners.value = listeners
  }

  onBeforeUpdate(update)

  update()

  return acc
}
