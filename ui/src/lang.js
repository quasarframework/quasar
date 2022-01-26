import defineReactivePlugin from './utils/private/define-reactive-plugin.js'
import defaultLang from '../lang/en-US.js'

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

const Plugin = defineReactivePlugin({
  __langPack: {}
}, {
  getLocale,

  set (langObject = defaultLang, ssrContext) {
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

      ssrContext._meta.htmlAttrs = ssrContext.__qPrevLang !== void 0
        ? ssrContext._meta.htmlAttrs.replace(ssrContext.__qPrevLang, attrs)
        : attrs

      ssrContext.__qPrevLang = attrs
      ssrContext.$q.lang = lang
    }
    else {
      const el = document.documentElement
      el.setAttribute('dir', lang.rtl === true ? 'rtl' : 'ltr')
      el.setAttribute('lang', lang.isoName)

      lang.set = Plugin.set

      Object.assign(Plugin.__langPack, lang)

      Plugin.props = lang
      Plugin.isoName = lang.isoName
      Plugin.nativeName = lang.nativeName
    }
  },

  install ({ $q, lang, ssrContext }) {
    if (__QUASAR_SSR_SERVER__) {
      const initialLang = lang || defaultLang

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
      $q.lang = Plugin.__langPack

      if (this.__installed === true) {
        lang !== void 0 && this.set(lang)
      }
      else {
        this.set(lang || defaultLang)
      }
    }
  }
})

export default Plugin
export { defaultLang }
