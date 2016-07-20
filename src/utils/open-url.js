import Environment from '../environment'
import Dialog from '../dialog/dialog'

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
    Dialog.create({
      title: 'Cannot Open Window',
      message: 'Please allow popups first, then please try again.'
    }).show()
  }
}
