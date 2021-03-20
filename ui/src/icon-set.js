import defineReactivePlugin from './utils/private/define-reactive-plugin.js'
import materialIcons from '../icon-set/material-icons.js'

const Plugin = defineReactivePlugin({
  iconMapFn: null,
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

      $q.iconMapFn = ssrContext.$q.config.iconMapFn || this.iconMapFn || null
      $q.iconSet = {}
      $q.iconSet.set = setObject => {
        this.set(setObject, ssrContext)
      }

      $q.iconSet.set(initialSet)
    }
    else {
      if ($q.config.iconMapFn !== void 0) {
        this.iconMapFn = $q.config.iconMapFn
      }

      $q.iconSet = this.__icons

      Object.defineProperty($q, 'iconMapFn', {
        get: () => this.iconMapFn,
        set: val => { this.iconMapFn = val }
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
