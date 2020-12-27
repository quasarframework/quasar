import { onBeforeUpdate } from 'vue'

const listenerRE = /^on[A-Z]/

export default function (attrs) {
  const acc = {}

  function update () {
    acc.listeners = {}
    acc.attributes = {}

    Object.keys(attrs).forEach(key => {
      if (listenerRE.test(key) === true) {
        acc.listeners[ key ] = attrs[ key ]
      }
      else if (key !== 'class' && key !== 'style') {
        acc.attributes[ key ] = attrs[ key ]
      }
    })
  }

  onBeforeUpdate(update)

  update()

  /**
   * The returned Object
   * is NOT reactive, so do NOT destructure it!
   */
  return acc
}
