import defineReactivePlugin from '../utils/private/define-reactive-plugin.js'
import { isRuntimeSsrPreHydration } from './Platform.js'

const Plugin = defineReactivePlugin({
  isActive: false,
  mode: false
}, {
  __media: void 0,

  set (val) {
    if (__QUASAR_SSR_SERVER__) { return }

    Plugin.mode = val

    if (val === 'auto') {
      if (Plugin.__media === void 0) {
        Plugin.__media = window.matchMedia('(prefers-color-scheme: dark)')
        Plugin.__updateMedia = () => { Plugin.set('auto') }
        Plugin.__media.addListener(Plugin.__updateMedia)
      }

      val = Plugin.__media.matches
    }
    else if (Plugin.__media !== void 0) {
      Plugin.__media.removeListener(Plugin.__updateMedia)
      Plugin.__media = void 0
    }

    Plugin.isActive = val === true

    document.body.classList.remove(`body--${ val === true ? 'light' : 'dark' }`)
    document.body.classList.add(`body--${ val === true ? 'dark' : 'light' }`)
  },

  toggle () {
    if (__QUASAR_SSR_SERVER__ !== true) {
      Plugin.set(Plugin.isActive === false)
    }
  },

  install (opts) {
    const { dark } = opts.cfg
    this.isActive = dark === true

    if (__QUASAR_SSR_SERVER__) {
      const { $q, ssrContext } = opts
      $q.dark = {
        isActive: false,
        mode: false,
        set: val => {
          ssrContext._meta.bodyClasses = ssrContext._meta.bodyClasses
            .replace(' body--light', '')
            .replace(' body--dark', '') + ` body--${ val === true ? 'dark' : 'light' }`

          $q.dark.isActive = val === true
          $q.dark.mode = val
        },
        toggle: () => {
          $q.dark.set($q.dark.isActive === false)
        }
      }

      $q.dark.set(dark)
      return
    }

    const initialVal = dark !== void 0 ? dark : false

    if (isRuntimeSsrPreHydration === true) {
      const ssrSet = val => {
        this.__fromSSR = val
      }

      const originalSet = this.set

      this.set = ssrSet
      ssrSet(initialVal)

      opts.onSSRHydrated.push(() => {
        this.set = originalSet
        this.set(this.__fromSSR)
      })
    }
    else {
      this.set(initialVal)
    }

    opts.$q.dark = this
  }
})

export default Plugin
