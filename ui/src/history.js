import { isSSR, client } from './plugins/Platform.js'
import { noop } from './utils/event.js'

const getTrue = () => true

export default {
  __history: [],
  add: noop,
  remove: noop,

  install (cfg) {
    if (isSSR === true) {
      return
    }

    const { cordova, capacitor } = client.is

    if (cordova !== true && capacitor !== true) {
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

    const fn = () => {
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
    }

    const prop = cordova === true ? 'cordova' : 'capacitor'
    const exit = cfg[prop] === void 0 || cfg[prop].backButtonExit !== false

    if (cordova === true) {
      document.addEventListener('deviceready', () => {
        document.addEventListener('backbutton', fn, false)
      })
    }
    else {
      window.Capacitor.Plugins.App.addListener('backButton', fn)
    }
  }
}
