import { isSSR, client } from './plugins/Platform.js'
import { noop } from './utils/event.js'

const getTrue = () => true

function filterInvalidPath (path) {
  return typeof path === 'string' &&
    path !== '' &&
    path !== '/' &&
    path !== '#/'
}

function normalizeExitPath (path) {
  path.startsWith('#') === true && (path = path.substr(1))
  path.startsWith('/') === false && (path = '/' + path)
  path.endsWith('/') === true && (path = path.substr(0, path.length - 1))
  return '#' + path
}

function getShouldExitFn (cfg) {
  if (cfg.backButtonExit === false) {
    return () => false
  }

  if (cfg.backButtonExit === '*') {
    return getTrue
  }

  // Add default root path
  const exitPaths = [ '#/' ]

  // Add custom exit paths
  Array.isArray(cfg.backButtonExit) === true && exitPaths.push(
    ...cfg.backButtonExit.filter(filterInvalidPath).map(normalizeExitPath)
  )

  return () => exitPaths.includes(window.location.hash)
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

    const qConf = cfg[cordova === true ? 'cordova' : 'capacitor']

    if (qConf !== void 0 && qConf.backButton === false) {
      return
    }

    // if the '@capacitor/app' plugin is not installed
    // then we got nothing to do
    if (
      // if we're on Capacitor mode
      capacitor === true &&
      // and it's also not in Capacitor's main instance
      (window.Capacitor === void 0 || window.Capacitor.Plugins.App === void 0)
    ) {
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

    const shouldExit = getShouldExitFn(
      Object.assign(
        { backButtonExit: true },
        qConf
      )
    )

    const backHandler = () => {
      if (this.__history.length) {
        const entry = this.__history[this.__history.length - 1]

        if (entry.condition() === true) {
          this.__history.pop()
          entry.handler()
        }
      }
      else if (shouldExit() === true) {
        navigator.app.exitApp()
      }
      else {
        window.history.back()
      }
    }

    if (cordova === true) {
      document.addEventListener('deviceready', () => {
        document.addEventListener('backbutton', backHandler, false)
      })
    }
    else {
      window.Capacitor.Plugins.App.addListener('backButton', backHandler)
    }
  }
}
