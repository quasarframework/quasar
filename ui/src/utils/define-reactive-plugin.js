import { reactive } from 'vue'

export default __QUASAR_SSR_SERVER__
  ? (state, plugin) => {
      Object.assign(plugin, state)
      return plugin
    }
  : (state, plugin) => {
      const props = {}
      const reactiveState = reactive(state)

      Object.keys(state).forEach(name => {
        props[ name ] = {
          get: () => reactiveState[ name ],
          set: val => { reactiveState[ name ] = val }
        }
      })

      Object.defineProperties(plugin, props)
      return plugin
    }
