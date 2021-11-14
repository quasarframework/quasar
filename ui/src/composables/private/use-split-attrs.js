import { ref, onBeforeUpdate } from 'vue'

const listenerRE = /^on[A-Z]/

export default function (attrs, vnode) {
  const acc = {
    listeners: ref({}),
    attributes: ref({})
  }

  const attrsList = Object.keys(attrs)
    .filter(key => key !== 'class' && key !== 'style' && listenerRE.test(key) === false)

  const listenersList = Object.keys(vnode.props)
    .filter(key => listenerRE.test(key) === true)

  function update () {
    const attributes = {}
    attrsList.forEach(key => { attributes[ key ] = attrs[ key ] })
    acc.attributes.value = attributes

    const listeners = {}
    listenersList.forEach(key => { listeners[ key ] = vnode.props[ key ] })
    acc.listeners.value = listeners
  }

  onBeforeUpdate(update)

  update()

  return acc
}
