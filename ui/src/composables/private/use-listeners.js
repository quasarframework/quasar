import { ref, onBeforeUpdate } from 'vue'

const listenerRE = /^on[A-Z]/

export default function (vnodeProps) {
  const listeners = ref({})

  function update () {
    const items = {}

    Object.keys(vnodeProps).forEach(key => {
      if (listenerRE.test(key) === true) {
        items[ key ] = vnodeProps[ key ]
      }
    })

    listeners.value = items
  }

  onBeforeUpdate(update)

  update()

  return listeners
}
