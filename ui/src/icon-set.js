import { reactive } from 'vue'

import materialIcons from '../icon-set/material-icons.js'

const state = reactive({
  iconMapFn: void 0
})

export default {
  set (setObject, ssrContext) {
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
      this.__q.iconSet = def
    }
  },

  install (opts) {
    const initialSet = opts.iconSet || materialIcons
    const { $q } = opts

    if (__QUASAR_SSR_SERVER__) {
      $q.iconSet = {}
      $q.iconSet.set = setObject => {
        this.set(setObject, opts.ssrContext)
      }

      $q.iconSet.set(initialSet)
    }
    else {
      $q.iconSet = reactive({})

      Object.defineProperty($q, 'iconMapFn', {
        get: () => state.iconMapFn,
        set: val => { state.iconMapFn = val }
      })

      this.__q = $q
      this.set(initialSet)
    }
  }
}
