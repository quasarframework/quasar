import { client, getNativeBridge } from '../platform/Platform.js'
import { noop } from '../../utils/event/event.js'

const getTrue = () => true

function filterInvalidPath(path) {
  return (
    typeof path === 'string' && path !== '' && path !== '/' && path !== '#/'
  )
}

function normalizeExitPath(path) {
  if (path.startsWith('#')) path = path.slice(1)
  if (!path.startsWith('/')) path = '/' + path
  if (path.endsWith('/')) path = path.slice(0, -1)
  return '#' + path
}

function getShouldExitFn(cfg) {
  if (cfg.backButtonExit === false) return () => false
  if (cfg.backButtonExit === '*') return getTrue

  // Add default root path
  const exitPaths = ['#/']

  // Add custom exit paths
  if (Array.isArray(cfg.backButtonExit)) {
    exitPaths.push(
      ...cfg.backButtonExit.filter(filterInvalidPath).map(normalizeExitPath)
    )
  }

  return () => exitPaths.includes(window.location.hash)
}

export default {
  __history: [],
  add: noop,
  remove: noop,

  install({ $q }) {
    if (__QUASAR_SSR_SERVER__ || this.__installed) return

    const { cordova, capacitor } = client.is
    if (!cordova && !capacitor) return

    const qConf = $q.config[cordova ? 'cordova' : 'capacitor']

    if (qConf?.backButton === false) return

    // if the '@capacitor/app' plugin is not installed
    // then we got nothing to do
    if (
      // if we're on Capacitor mode
      capacitor &&
      // and it's also not in Capacitor's main instance
      typeof getNativeBridge('Capacitor')?.Plugins?.App?.addListener !==
        'function'
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
      if (index !== -1) {
        this.__history.splice(index, 1)
      }
    }

    const shouldExit = getShouldExitFn({ backButtonExit: true, ...qConf })

    const backHandler = () => {
      if (this.__history.length !== 0) {
        const entry = this.__history.at(-1)

        if (entry.condition()) {
          this.__history.pop()
          entry.handler()
        }
      } else if (shouldExit()) {
        navigator.app.exitApp()
      } else {
        window.history.back()
      }
    }

    if (cordova) {
      document.addEventListener('deviceready', () => {
        document.addEventListener('backbutton', backHandler, false)
      })
    } else {
      window.Capacitor.Plugins.App.addListener('backButton', backHandler)
    }
  }
}
