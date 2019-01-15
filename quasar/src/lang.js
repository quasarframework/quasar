import Vue from 'vue'

import langEn from '../lang/en-us.js'
import { isSSR } from './plugins/Platform.js'

export default {
  install ($q, queues, lang) {
    if (isSSR) {
      queues.server.push((q, ctx) => {
        const
          opt = {
            lang: q.lang.isoName,
            dir: q.lang.rtl === true ? 'rtl' : 'ltr'
          },
          fn = ctx.ssr.setHtmlAttrs

        if (typeof fn === 'function') {
          fn(opt)
        }
        else {
          ctx.ssr.Q_HTML_ATTRS = Object.keys(opt)
            .map(key => `${key}=${opt[key]}`)
            .join(' ')
        }
      })
    }

    this.set = (lang = langEn) => {
      lang.set = this.set
      lang.getLocale = this.getLocale
      lang.rtl = lang.rtl || false

      if (!isSSR) {
        const el = document.documentElement
        el.setAttribute('dir', lang.rtl ? 'rtl' : 'ltr')
        el.setAttribute('lang', lang.isoName)
      }

      if (isSSR || $q.lang) {
        $q.lang = lang
      }
      else {
        Vue.util.defineReactive($q, 'lang', lang)
      }

      this.isoName = lang.isoName
      this.nativeName = lang.nativeName
      this.props = lang
    }

    this.set(lang)
  },

  getLocale () {
    if (isSSR) { return }

    let val =
      navigator.language ||
      navigator.languages[0] ||
      navigator.browserLanguage ||
      navigator.userLanguage ||
      navigator.systemLanguage

    if (val) {
      return val.toLowerCase()
    }
  }
}
