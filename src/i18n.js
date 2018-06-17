import langEn from '../i18n/en-us'
import { isSSR } from './plugins/platform'
import { ready } from './utils/dom'

export function ssrUpdateLang (ctx) {
  const fn = ctx.ssr.setHtmlAttrs
  if (typeof fn === 'function') {
    const { rtl, lang } = ctx.app.$q.i18n
    fn({ lang, dir: rtl ? 'rtl' : 'ltr' })
  }
}

export default {
  install ({ $q, Vue, lang }) {
    if (this.__installed) { return }
    this.__installed = true

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
