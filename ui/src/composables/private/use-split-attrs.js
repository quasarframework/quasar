import { ref, onBeforeUpdate } from 'vue'

const listenerRE = /^on[A-Z]/

export default function (attrs) {
  const acc = {
    listeners: ref({}),
    attributes: ref({})
  }

  function update () {
    const listeners = {}
    const attributes = {}

    Object.keys(attrs).forEach(key => {
      if (listenerRE.test(key) === true) {
        listeners[ key ] = attrs[ key ]
      }
      else if (key !== 'class' && key !== 'style') {
        attributes[ key ] = attrs[ key ]
      }
    })

    acc.listeners.value = listeners
    acc.attributes.value = attributes
  }

  onBeforeUpdate(update)

  update()

  return acc
}
