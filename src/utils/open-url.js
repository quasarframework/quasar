import Environment from '../environment'

/* istanbul ignore next */
export default (url) => {
  if (Environment.runs.on.cordova) {
    navigator.app.loadUrl(url, {
      openExternal: true
    })

    return
  }

  let win = window.open(url, '_blank')

  if (win) {
    win.focus()
  }
  else {
    /* TODO
    quasar.dialog({
      title: 'Cannot Open Window',
      message: 'Please allow popups first, then please try again.'
    })
    */
  }
}
