import Vue from 'vue'

import defaultLang from '../lang/en-us.js'
import { isSSR, fromSSR } from './plugins/Platform.js'

function getLocale () {
  if (isSSR === true) { return }

  const val =
    navigator.language ||
    navigator.languages[0] ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    navigator.systemLanguage

  if (val) {
    return val.toLowerCase()
  }
}

const Plugin = {
  getLocale,

  install ($q, queues, lang) {
    const initialLang = lang || defaultLang

    this.set = (langObject = defaultLang, ssrContext) => {
      const lang = {
        ...langObject,
        rtl: langObject.rtl === true,
        getLocale
      }

      if (isSSR === true) {
        if (ssrContext === void 0) {
          console.error('SSR ERROR: second param required: Quasar.lang.set(lang, ssrContext)')
          return
        }

        const dir = lang.rtl === true ? 'rtl' : 'ltr'
        const attrs = `lang=${lang.isoName} dir=${dir}`

        lang.set = ssrContext.$q.lang.set

        ssrContext.Q_HTML_ATTRS = ssrContext.Q_PREV_LANG !== void 0
          ? ssrContext.Q_HTML_ATTRS.replace(ssrContext.Q_PREV_LANG, attrs)
          : attrs

        ssrContext.Q_PREV_LANG = attrs
        ssrContext.$q.lang = lang
      }
      else {
        if (fromSSR === false) {
          const el = document.documentElement
          el.setAttribute('dir', lang.rtl === true ? 'rtl' : 'ltr')
          el.setAttribute('lang', lang.isoName)
        }

        lang.set = this.set
        $q.lang = this.props = lang
        this.isoName = lang.isoName
        this.nativeName = lang.nativeName
      }
    }

    if (isSSR === true) {
      queues.server.push((q, ctx) => {
        q.lang = {}
        q.lang.set = langObject => {
          this.set(langObject, ctx.ssr)
        }

        q.lang.set(initialLang)
      })

      this.isoName = initialLang.isoName
      this.nativeName = initialLang.nativeName
      this.props = initialLang
    }
    else {
      Vue.util.defineReactive($q, 'lang', {})
      this.set(initialLang)
    }
  }
}

export default Plugin
export { defaultLang }
