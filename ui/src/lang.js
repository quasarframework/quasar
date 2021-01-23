import Vue from 'vue'

import langEn from '../lang/en-us.js'
import { isSSR, fromSSR } from './plugins/Platform.js'

const localeRe = /^\s*([^-]+)(?:-(.+))\s*$/

function normalizeLocale (_, p1, p2) {
  const locale = p1.toLowerCase()

  if (typeof p2 === 'string' && p2.length > 0) {
    return locale + '-' + (
      p2.length < 3
        ? p2.toUpperCase()
        : (p2[0].toUpperCase() + p2.slice(1).toLowerCase())
    )
  }

  return locale
}

function getLocale () {
  if (isSSR === true) { return }

  const val = Array.isArray(navigator.languages) === true && navigator.languages.length > 0
    ? navigator.languages[0]
    : navigator.language

  return typeof val === 'string'
    ? val.replace(localeRe, normalizeLocale)
    : void 0
}

export default {
  getLocale,

  install ($q, queues, lang) {
    const initialLang = lang || langEn

    this.set = (langObject = langEn, ssrContext) => {
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
