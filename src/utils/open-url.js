import Platform from '../features/platform'

export default (url, reject) => {
  if (Platform.is.cordova) {
    return navigator.app.loadUrl(url, {
      openExternal: true
    })
  }

  let win = window.open(url, '_blank')

  if (win) {
    win.focus()
  }
  else {
    reject()
  }
}
