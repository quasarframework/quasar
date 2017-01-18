import Platform from './features/platform'
import { ready } from './utils/dom'

export default function (callback = function () {}) {
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

  ready(callback)
}
