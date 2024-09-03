import { defineComponent, markRaw, reactive } from 'vue'
import { injectProp } from '../private.inject-obj-prop/inject-obj-prop.js'

export function createComponent (raw) { return markRaw(defineComponent(raw)) }
export function createDirective (raw) { return markRaw(raw) }

export const createReactivePlugin = __QUASAR_SSR_SERVER__
  ? (state, plugin) => {
      Object.assign(plugin, state)
      return plugin
    }
  : (state, plugin) => {
      const reactiveState = reactive(state)

      for (const name in state) {
        injectProp(
          plugin,
          name,
          () => reactiveState[ name ],
          val => { reactiveState[ name ] = val }
        )
      }

      return plugin
    }
