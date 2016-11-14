import Platform from './features/platform'
import Utils from './utils'
import * as theme from './features/theme'

export default function (callback = function () {}) {
  Utils.dom.ready(() => {
    if (!theme.current) {
      theme.set(Platform.is.ios ? 'ios' : 'mat')
    }
  })

  /*
    if on Cordova, but not on an iframe,
    like on Quasar Play app
   */
  if (Platform.is.cordova && !Platform.within.iframe) {
    var tag = document.createElement('script')

    document.addEventListener('deviceready', callback, false)

    tag.type = 'text/javascript'
    document.body.appendChild(tag)
    tag.src = 'cordova.js'

    return
  }

  callback()
}
