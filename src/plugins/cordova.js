
export default {
  __installed: false,
  install ({ Quasar }) {
    if (this.__installed) { return }
    this.__installed = true

    document.addEventListener('deviceready', () => {
      Quasar.cordova = window.cordova
    }, false)
  }
}
