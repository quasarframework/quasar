import Platform from '../features/platform'

export default (url, reject) => {
  if (Platform.is.cordova && navigator && navigator.app) {
    return navigator.app.loadUrl(url, {
      openExternal: true
    })
  }

  let win = window.open(url, '_blank')

  if (win) {
    win.focus()
    return win
  }
  else {
    reject()
  }
}
