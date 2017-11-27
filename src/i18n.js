import langEn from '../i18n/en'

export default {
  __installed: false,
  install ({ $q, Vue, lang }) {
    if (this.__installed) { return }
    this.__installed = true

    this.set = (lang = langEn) => {
      Vue.set($q, 'i18n', lang)
      this.lang = lang
    }

    this.set(lang)
  }
}
