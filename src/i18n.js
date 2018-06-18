import langEn from '../i18n/en-us'
import { isSSR } from './plugins/platform'
import { ready } from './utils/dom'

export default {
  install ($q, queues, Vue, lang) {
    if (isSSR) {
      queues.server.push((q, ctx) => {
        const fn = ctx.ssr.setHtmlAttrs
        if (typeof fn === 'function') {
          fn({
            lang: q.i18n.lang,
            dir: q.i18n.rtl ? 'rtl' : 'ltr'
          })
        }
      })
    }

    this.set = (lang = langEn) => {
      lang.set = this.set
      lang.getLocale = this.getLocale
      lang.rtl = lang.rtl || false

      if (!isSSR) {
        ready(() => {
          const el = document.documentElement
          el.setAttribute('dir', lang.rtl ? 'rtl' : 'ltr')
          el.setAttribute('lang', lang.lang)
        })
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
