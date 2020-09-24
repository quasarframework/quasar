import { reactive } from 'vue'

import { isSSR } from '../plugins/Platform.js'

export default isSSR === true
  ? (state, plugin) => {
    Object.assign(plugin, state)
    return plugin
  }
  : (state, plugin) => {
    const props = {}
    const reactiveState = reactive(state)

    Object.keys(state).forEach(name => {
      props[name] = {
        get: () => reactiveState[name],
        set: val => { reactiveState[name] = val }
      }
    })

    Object.defineProperties(plugin, props)
    return plugin
  }