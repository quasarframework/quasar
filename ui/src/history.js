import { isSSR } from './plugins/Platform.js'

const getTrue = () => true

export default {
  __history: [],
  add: () => {},
  remove: () => {},

  install ($q, cfg) {
    if (isSSR === true || $q.platform.is.cordova !== true) {
      return
    }

    this.add = entry => {
      if (entry.condition === void 0) {
        entry.condition = getTrue
      }
      this.__history.push(entry)
    }
    this.remove = entry => {
      const index = this.__history.indexOf(entry)
      if (index >= 0) {
        this.__history.splice(index, 1)
      }
    }

    const exit = cfg.cordova === void 0 || cfg.cordova.backButtonExit !== false

    document.addEventListener('deviceready', () => {
      document.addEventListener('backbutton', () => {
        if (this.__history.length) {
          const entry = this.__history[this.__history.length - 1]

          if (entry.condition() === true) {
            this.__history.pop()
            entry.handler()
          }
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
