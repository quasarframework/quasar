import { ref, reactive } from 'vue'

import materialIcons from '../icon-set/material-icons.js'

const Plugin = {
  set (setObject, ssrContext) {
    const def = { ...setObject, rtl: setObject.rtl === true }

    if (__QUASAR_SSR_SERVER__) {
      if (ssrContext === void 0) {
        console.error('SSR ERROR: second param required: Quasar.iconSet.set(iconSet, ssrContext)')
        return
      }

      def.set = ssrContext.$q.iconSet.set
      Object.assign(ssrContext.$q.iconSet, def)
    }
    else {
      def.set = Plugin.set
      Object.assign(Plugin.__q.iconSet, def)
    }
  },

  install (opts) {
    const initialSet = opts.iconSet || materialIcons
    const { $q } = opts

    if (__QUASAR_SSR_SERVER__) {
      $q.iconMapFn = null
      $q.iconSet = {}
      $q.iconSet.set = setObject => {
        this.set(setObject, opts.ssrContext)
      }

      $q.iconSet.set(initialSet)
    }
    else {
      const iconMapFn = ref(null)

      $q.iconSet = reactive({})

      Object.defineProperty($q, 'iconMapFn', {
        get: () => iconMapFn.value,
        set: val => { iconMapFn.value = val }
      })

      this.__q = $q
      this.set(initialSet)
    }
  }
}

export default Plugin
