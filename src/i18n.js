import langEn from '../i18n/en-us.js'
import { isSSR } from './plugins/platform.js'

export default {
  install ($q, queues, Vue, lang) {
    if (isSSR) {
      queues.server.push((q, ctx) => {
        const
          opt = {
            lang: q.i18n.lang,
            dir: q.i18n.rtl ? 'rtl' : 'ltr'
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
        el.setAttribute('lang', lang.lang)
      }

      if (isSSR || $q.i18n) {
        $q.i18n = lang
      }
      else {
        Vue.util.defineReactive($q, 'i18n', lang)
      }

      this.name = lang.lang
      this.lang = lang
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
