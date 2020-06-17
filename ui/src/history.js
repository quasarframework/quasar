import { isSSR, client } from './plugins/Platform.js'
import { noop } from './utils/event.js'

const getTrue = () => true

function filterInvalidPath (path) {
  return typeof path === 'string' && !(path === '' || path === '/' || path === '#/')
}

function normalizeExitPath (path) {
  path.startsWith('#') && (path = path.substr(1))
  !path.startsWith('/') && (path = '/' + path)
  path.endsWith('/') && (path = path.substr(0, path.length - 1))
  return '#' + path
}

function shouldExitOnAnyPath (cfg) {
  return cfg && cfg.backButtonExit === '*'
}

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
      else if (exit && (shouldExitOnAnyPath(cfg[prop]) || exitPaths.includes(window.location.hash))) {
        navigator.app.exitApp()
      }
      else {
        window.history.back()
      }
    }

    const prop = cordova === true ? 'cordova' : 'capacitor'
    const exit = cfg[prop] === void 0 || cfg[prop].backButtonExit !== false

    // Add default root path
    const exitPaths = ['#/']
    // Add custom exit paths
    if (cfg[prop] !== void 0 && Array.isArray(cfg[prop].backButtonExit)) {
      exitPaths.push(...cfg[prop].backButtonExit.filter(filterInvalidPath).map(normalizeExitPath))
    }

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
