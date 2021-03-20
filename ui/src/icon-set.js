import { ref } from 'vue'

import defineReactivePlugin from './utils/private/define-reactive-plugin.js'
import materialIcons from '../icon-set/material-icons.js'

const Plugin = defineReactivePlugin({
  __icons: {}
}, {
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
      Object.assign(Plugin.__icons, def)
    }
  },

  install ({ $q, iconSet, ssrContext }) {
    if (__QUASAR_SSR_SERVER__) {
      const initialSet = iconSet || materialIcons

      $q.iconMapFn = null
      $q.iconSet = {}
      $q.iconSet.set = setObject => {
        this.set(setObject, ssrContext)
      }

      $q.iconSet.set(initialSet)
    }
    else {
      const iconMapFn = ref(null)

      $q.iconSet = Plugin.__icons

      Object.defineProperties($q, {
        iconMapFn: {
          get: () => iconMapFn.value,
          set: val => { iconMapFn.value = val }
        }
      })

      if (this.__installed === true) {
        iconSet !== void 0 && this.set(iconSet)
      }
      else {
        this.set(iconSet || materialIcons)
      }
    }
  }
})

export default Plugin
