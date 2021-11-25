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

    Object.keys(attrs).forEach(key => {
      if (key !== 'class' && key !== 'style' && listenerRE.test(key) === false) {
        attributes[ key ] = attrs[ key ]
      }
    })

    Object.keys(vnode.props).forEach(key => {
      if (listenerRE.test(key) === true) {
        listeners[ key ] = vnode.props[ key ]
      }
    })

    acc.attributes.value = attributes
    acc.listeners.value = listeners
  }

  onBeforeUpdate(update)

  update()

  return acc
}
