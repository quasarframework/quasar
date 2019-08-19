import Platform from '../plugins/Platform.js'
import Vue from 'vue'

export default (url, reject) => {
  let open = window.open

  if (Platform.is.cordova === true) {
    if (cordova !== void 0 && cordova.InAppBrowser !== void 0 && cordova.InAppBrowser.open !== void 0) {
      open = cordova.InAppBrowser.open
    }
    else if (navigator !== void 0 && navigator.app !== void 0) {
      return navigator.app.loadUrl(url, {
        openExternal: true
      })
    }
  }
  else if (Vue.prototype.$q.electron !== void 0) {
    return Vue.prototype.$q.electron.shell.openExternal(url)
  }

  let win = open(url, '_blank')

  if (win) {
    win.focus()
    return win
  }
  else {
    reject && reject()
  }
}
