import { isSSR } from './plugins/Platform.js'

export default {
  __history: [],
  add: () => {},
  remove: () => {},

  install ($q, cfg) {
    if (isSSR || !$q.platform.is.cordova) {
      return
    }

    this.add = definition => {
      this.__history.push(definition)
    }
    this.remove = definition => {
      const index = this.__history.indexOf(definition)
      if (index >= 0) {
        this.__history.splice(index, 1)
      }
    }

    const exit = cfg.cordova === void 0 || cfg.cordova.backButtonExit !== false

    document.addEventListener('deviceready', () => {
      document.addEventListener('backbutton', () => {
        if (this.__history.length) {
          this.__history.pop().handler()
        }
        else if (exit && window.location.hash === '#/') {
          navigator.app.exitApp()
        }
        else {
          window.history.back()
        }
      }, false)
    })
  }
}
