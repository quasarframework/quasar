import langEn from '../i18n/en-us'

export default {
  __installed: false,
  install ({ $q, Vue, lang }) {
    if (this.__installed) { return }
    this.__installed = true

    this.set = (lang = langEn) => {
      lang.set = this.set

      Vue.set($q, 'i18n', lang)
      this.name = lang.lang
      this.lang = lang
    }

    this.set(lang)
  }
}
