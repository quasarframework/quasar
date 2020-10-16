import { reactive } from 'vue'

import materialIcons from '../icon-set/material-icons.js'

const state = reactive({
  iconMapFn: void 0
})

export default {
  install ($q, queues, iconSet) {
    const initialSet = iconSet || materialIcons

    this.set = (setObject, ssrContext) => {
      const def = { ...setObject }

      if (__QUASAR_SSR_SERVER__) {
        if (ssrContext === void 0) {
          console.error('SSR ERROR: second param required: Quasar.iconSet.set(iconSet, ssrContext)')
          return
        }

        def.set = ssrContext.$q.iconSet.set
        ssrContext.$q.iconSet = def
      }
      else {
        def.set = this.set
        $q.iconSet = def
      }
    }

    if (__QUASAR_SSR_SERVER__) {
      queues.server.push((q, ctx) => {
        q.iconSet = {}
        q.iconSet.set = setObject => {
          this.set(setObject, ctx.ssr)
        }

        q.iconSet.set(initialSet)
      })
    }
    else {
      $q.iconSet = reactive({})

      Object.defineProperty($q, 'iconMapFn', {
        get: () => state.iconMapFn,
        set: val => { state.iconMapFn = val }
      })

      this.set(initialSet)
    }
  }
}
