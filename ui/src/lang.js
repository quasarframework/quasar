import { reactive } from 'vue'

import langEn from '../lang/en-US.js'
import { isRuntimeSsrPreHydration } from './plugins/Platform.js'

function getLocale () {
  if (__QUASAR_SSR_SERVER__) { return }

  const val = Array.isArray(navigator.languages) === true && navigator.languages.length > 0
    ? navigator.languages[ 0 ]
    : navigator.language

  if (typeof val === 'string') {
    return val.split(/[-_]/).map((v, i) => (
      i === 0
        ? v.toLowerCase()
        : (
            i > 1 || v.length < 4
              ? v.toUpperCase()
              : (v[ 0 ].toUpperCase() + v.slice(1).toLowerCase())
          )
    )).join('-')
  }
}

const Plugin = {
  getLocale,

  set (langObject = langEn, ssrContext) {
    const lang = {
      ...langObject,
      rtl: langObject.rtl === true,
      getLocale
    }

    if (__QUASAR_SSR_SERVER__) {
      if (ssrContext === void 0) {
        console.error('SSR ERROR: second param required: Quasar.lang.set(lang, ssrContext)')
        return
      }

      const dir = lang.rtl === true ? 'rtl' : 'ltr'
      const attrs = `lang=${ lang.isoName } dir=${ dir }`

      lang.set = ssrContext.$q.lang.set

      ssrContext._meta.htmlAttrs = ssrContext.Q_PREV_LANG !== void 0
        ? ssrContext._meta.htmlAttrs.replace(ssrContext.Q_PREV_LANG, attrs)
        : attrs

      ssrContext.Q_PREV_LANG = attrs
      ssrContext.$q.lang = lang
    }
    else {
      if (isRuntimeSsrPreHydration === false) {
        const el = document.documentElement
        el.setAttribute('dir', lang.rtl === true ? 'rtl' : 'ltr')
        el.setAttribute('lang', lang.isoName)
      }

      lang.set = Plugin.set

      Object.assign(Plugin.__q.lang, lang)

      Plugin.props = lang
      Plugin.isoName = lang.isoName
      Plugin.nativeName = lang.nativeName
    }
  },

  install (opts) {
    const initialLang = opts.lang || langEn

    if (__QUASAR_SSR_SERVER__) {
      const { $q, ssrContext } = opts

      $q.lang = {}
      $q.lang.set = langObject => {
        this.set(langObject, ssrContext)
      }

      $q.lang.set(initialLang)

      // one-time SSR server operation
      if (this.isoName !== initialLang.isoName) {
        this.isoName = initialLang.isoName
        this.nativeName = initialLang.nativeName
        this.props = initialLang
      }
    }
    else {
      opts.$q.lang = reactive({})

      this.__q = opts.$q
      this.set(initialLang)
    }
  }
}

export default Plugin
